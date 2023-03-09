import BaseController from './BaseController'
import RoleModel from '@root/server/app/Models/RoleModel'
import TenantsModel from '@root/server/app/Models/TenantsModel'
import UserModel from '@root/server/app/Models/UserModel'
import ApiException from '@app/Exceptions/ApiException'
import constantConfig from '@config/constant'
import { removeVietnameseTones ,hashNumber ,makeKey} from '@helpers/utils'
import PermissionModel from '@root/server/app/Models/PermissionModel'
import RolePermissionModel from '@root/server/app/Models/RolePermissionModel'
import _ from 'lodash'
const { roleKey,default_premission } = constantConfig
import MailService from '@root/server/app/Services/Mail'

export default class RoleController extends BaseController {
  Model: any = TenantsModel
  UserModel: any = UserModel
  RoleModel: any = RoleModel
  PermissionModel: any = PermissionModel
  RolePermissionModel: any = RolePermissionModel
  async index() {
    const inputs = this.request.all();
    const { auth } = this.request;
    const project = ['tenants.*']
    let query = this.Model.query()
      .select(project)
    let result = await query.getForGridTable(inputs);
    result.data = result.data.map(item => {
      return {
        ...item,
        others: {
          firstName: item.others.firstName,
          lastName: item.others.lastName,
          email: item.others.email,
        }
      }
    })
    return result;
  }

  async detail() {
    const allowFields = {
      id: "string!"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let result = await this.Model.getOne({ code: params.id });
    if (!result) throw new ApiException(6028, "Tenant doesn't exist!")

    return result
  }


  async store() {
    const { auth } = this.request
    const allowFields = {
      firstName: "string!",
      lastName: "string!",
      // username: "string!",
      password: "string!",
      email: "string!",
      twofa: "boolean",
      address: "string",
      name: "string!",
      phone: "string",
      emailTenant: "string",
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let twofaKey = makeKey(32);
    do {
      twofaKey = makeKey(32);
    } while (!!await this.UserModel.getOne({ twofaKey: twofaKey }))
    let twoFa = typeof params.twofa === 'undefined' ? 0 : params.twofa ? 1 : 0;

    let emailExist = await this.UserModel.findExist(params.email, 'email')
    if (emailExist) throw new ApiException(6026, "Email user already exists!")
    let email = await this.Model.findExist(params.email, 'email')
    if (email) throw new ApiException(6027, "Email tenant already exists!")
    
    let Tenant = {
      name: params.name,
      email: params.emailTenant,
      phone: params.phone,
      address: params.address,
      state: 'deactive',
      others: JSON.stringify({
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
        email: params.email,
        createdBy: auth.id,
        twofaKey: twofaKey,
        twofa: twoFa,
        isFirst: 1
      })
    }
    let result = await this.Model.insertOne({ ...Tenant});
    let code = hashNumber(String(result.id));
    await this.Model.updateOne(result.id, { code: code });
    delete result.others['password']
    delete result.others['twofaKey']
    delete result.others['isFirst']
    delete result.others['twofa']
    return result
  }

  async update() {
    const { auth } = this.request
    const allowFields = {
      id: "string!",
      firstName: "string!",
      lastName: "string!",
      password: "string!",
      email: "string!",
      twofa: "boolean",
      address: "string",
      name: "string!",
      phone: "string",
      emailTenant: "string",
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let { id } = params
    let tenantDB = await this.Model.getOne({ code: id });
    if(!tenantDB) throw new ApiException(6028, "Tenant doesn't exist!")
    if(tenantDB.state == 'active') throw new ApiException(6029, "Tenant is active!")

    let emailExist = await this.UserModel.findExist(params.email, 'email')
    if (emailExist) throw new ApiException(6026, "Email user already exists!")
    let email = await this.Model.findExist(params.email, 'email')
    if (email) throw new ApiException(6027, "Email tenant already exists!")
    
    let Tenant = {
      name: params.name,
      email: params.emailTenant,
      phone: params.phone,
      address: params.address,
      others: JSON.stringify({
        ...tenantDB.others,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
        email: params.email,
      })
    }
    let result = await this.Model.updateOne(tenantDB.id, { ...Tenant });
    delete result.others['password']
    delete result.others['twofaKey']
    delete result.others['isFirst']
    delete result.others['twofa']
    return result
  }

  async destroy() {
    const allowFields = {
      id: "string!"
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let tenantDB = await this.Model.getOne({ code: params.id });
    if(tenantDB.id ==  1) throw new ApiException(6032, "Tenant is default cannot be deleted!") 
    if(!tenantDB) throw new ApiException(6028, "Tenant doesn't exist!")
    let listUserTenant = await this.UserModel.query().where('tenantId', tenantDB.id)
    let roleTenant = await this.RoleModel.query().where('tenantId', tenantDB.id)
    if(!_.isEmpty(listUserTenant)) throw new ApiException(6030, "Tenant contains user cannot be deleted!")
    if(!_.isEmpty(roleTenant)) throw new ApiException(6031, "Tenant contains user cannot be deleted!")

    let result = await this.Model.deleteById(tenantDB.id);
    delete result.others['password']
    delete result.others['twofaKey']
    delete result.others['isFirst']
    delete result.others['twofa']
    return result
  }

  async delete() {
    const allowFields = {
      ids: ["number!"]
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);

    let tenantDBs = await this.Model.query().whereIn('id', params.ids);
    if (tenantDBs.length !== params.ids.length) throw new ApiException(6028, "Tenant doesn't exist!")
    let listUserTenant = await this.UserModel.query().whereIn('tenantId', tenantDBs.map(item => item.id))
    let roleTenant = await this.RoleModel.query().whereIn('tenantId', tenantDBs.map(item => item.id))
    if(!_.isEmpty(listUserTenant)) throw new ApiException(6030, "Tenant contains user cannot be deleted!")
    if(!_.isEmpty(roleTenant)) throw new ApiException(6031, "Tenant contains user cannot be deleted!")
    if(tenantDBs.find(item => item.id == 1)) throw new ApiException(6032, "Tenant is default cannot be deleted!")

    await this.Model.deleteByIds(tenantDBs.map(item => item.id));
    return 
  }

  async activeTenants() {
    const allowFields = {
      code : "string!"
    }
    const { auth } = this.request
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let tenants = await this.Model.getOne({ code: params.code });
    if (!tenants) throw new ApiException(6028, "Tenant doesn't exist!")
    let dataRole = {
      name: tenants.name + " Admin",
      description: `Belongs to ${tenants.name} company with address ${tenants.address}`,
      key: removeVietnameseTones(tenants.name + " admin" + tenants.id),
      tenantId: tenants.id,
      createdBy: auth.id,
    }
    let default_pre = default_premission || {}

    let trx = await this.Model.startTransaction();
    try { 
      let role = await this.RoleModel.query().transacting(trx).insert({ ...dataRole });
      let code = hashNumber(String(role.id));
      await this.RoleModel.query().transacting(trx).where('id',role.id).update({ code: code });

      //update permissions
      for (let key in default_pre) {
        const value = default_pre[key]
  
        const exist = await this.PermissionModel.getByKey(key);
        if (!exist) throw new ApiException(7003, `${key} doesn't exist`);
  
        const RolePermission = await this.RolePermissionModel.getByPermissionKey({ key, roleId: role.id });
        // kiem tra gia tri moi cua quyen
        if (!value) { //truong hop xoa bo quyen cu
          await this.RolePermissionModel.query().query().transacting(trx).delete().where({ roleId: role.id, key });
        }
        else if (!RolePermission) { //quyen moi chua ton tai trong DB
          await this.RolePermissionModel.query().transacting(trx).insert({
            key,
            roleId: role.id,
            permissionId: exist.id,
            value, createdBy: auth.id
          });
        }
        else if (RolePermission.value != value) { //update lai gia tri moi
          await this.RolePermissionModel.query().transacting(trx).where('id',RolePermission.id).update({ value: value })
        }
      }
      let password = await this.UserModel.hash(tenants.others.password);

      let dataUser = {
        firstName: tenants.others.firstName,
        lastName: tenants.others.lastName,
        password: password,
        email: tenants.others.email,
        createdBy: tenants.others.createdBy,
        twofaKey: tenants.others.twofaKey,
        twofa: tenants.others.twofa,
        isFirst: tenants.others.isFirst,
        roleId: role.id,
        Active_status: 1,
        tenantId: tenants.id,
      }
      let user = await this.UserModel.query().transacting(trx).insert(dataUser);
      let codeUser = hashNumber(String(user.id));
      await this.UserModel.query().transacting(trx).where('id',user.id).update({ code: codeUser });
      await this.Model.query().transacting(trx).where('id',tenants.id).update({ state: 'active' });
      let variables = {
        email: tenants.others.email,
        password: tenants.others.password
      }
      let subject = "KDDI Account — Create tenant successfully"
      let content = `<div style="width: 100%;
            height: 400px;
            text-align: center;
            color: rgb(255, 255, 255);
            padding: 3px;
            font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #364574;
            ">
        <h1>Application-Platform</h1>
        <div style="
                max-width: 840px;
                height: 280px;
                text-align: center;
                background-color: #fff;
                border: solid 1px rgb(218, 218, 218);
                color: #364574;
                padding: 5px;
                margin: auto;">
          <h2>Create new tenant information</h2>
          <br />
        <div style="text-align:left;padding: 5px;"> 
          Welcome ${tenants.others.email} ,admin account of company ${tenants.name} has been created<br />  
          Please use your email and given password to login the system <br/>
          <h3 style="font-weight: bold"> Your password: ${tenants.others.password}</h3><br/> 
          <h3 style="font-weight: bold">*Important: Please change your password after login successfully </h3> <br/>
          <p>Best regards</p>
          </div>
        </div>
      </div>
          `
      MailService.send(tenants.others.email, subject, content, variables)
      await trx.commit();
      delete tenants.others['twofaKey']
      delete tenants.others['isFirst']
      delete tenants.others['twofa']
      return tenants
    } catch (error) {
      console.log(error);
      trx.rollback();
      throw error;
    }
  }
}
