import BaseController from './BaseController'
import RolePermissionModel from "@root/server/app/Models/RolePermissionModel";
import PermissionModel from "@root/server/app/Models/PermissionModel";
import RoleModel from "@root/server/app/Models/RoleModel";
import ApiException from '@app/Exceptions/ApiException'
import UserModel from "@root/server/app/Models/UserModel";
import Logger from '@core/Logger'
const logger = Logger('Permission');
import constantConfig from '@config/constant'
const { roleKey } = constantConfig
export default class PermissionController extends BaseController {
  Model: any = PermissionModel;
  RolePermissionModel: any = RolePermissionModel;
  RoleModel: any = RoleModel;
  UserModel: any = UserModel;

  async update() {
    const { auth } = this.request
    let user = await this.UserModel.getById(auth.id)
    logger.info(`Update Per [usernameUpdate:${user.email}] `)
    const allowFields = {
      roleCode: "string!"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    const { roleCode } = params;
    const { permissions } = inputs

    if (!permissions) {
      logger.error(`Critical:Update Per ERR: No data per`);
      throw new ApiException(6005, "No data");
    }

    let rolecheck = await this.RoleModel.getOne({ code: roleCode });
    if (!rolecheck) {
      logger.error(`Critical:Update Per ERR: role doesn't exist!`);
      throw new ApiException(6000, "User role doesn't exist!")
    }
    if(rolecheck.tenantId != await this.UserModel.getTenantId(auth.id)){
      logger.error(`Critical:Update Per ERR: tenant is not correct!`);
      throw new ApiException(6000, "tenant is not correct!")
    }

    for (let key in permissions) {
      const value = permissions[key]

      const exist = await this.Model.getByKey(key);
      if (!exist) {
        logger.error(`Critical:Update Per ERR: ${key} doesn't exist`);
        throw new ApiException(7003, `${key} doesn't exist`);
      }

      const role = await this.RolePermissionModel.getByPermissionKey({ key, roleId: rolecheck.id });
      // kiem tra gia tri moi cua quyen
      if (!value) { //truong hop xoa bo quyen cu
        await this.RolePermissionModel.query().delete().where({ roleId: rolecheck.id, key });
      }
      else if (!role) { //quyen moi chua ton tai trong DB
        await this.RolePermissionModel.insertOne({
          key,
          roleId: rolecheck.id,
          permissionId: exist.id,
          value, createdBy: auth.id
        });
      }
      else if (role.value != value) { //update lai gia tri moi
        await this.RolePermissionModel.updateOne(role.id, { value: value })
      }
    }
    logger.info(`Update Per [usernameUpdate:${user.email}] list permission success ${permissions} `)

    return { message: `Update successfully` }
  }

  async getPermissionByGroupId() {
    const allowFields = {
      roleCode: "string!"
    }
    const { auth } = this.request
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let role = await this.RoleModel.getOne({ code: params.roleCode });
    if (!role) throw new ApiException(6000, "User role doesn't exist!")
    let permissions = []
    if(role.key  == 'root'){
      permissions = await this.Model.query().whereNot({key : 'root'})
    }else {
      let roleParent = await this.RoleModel.getById(role.parentId);
      if(!roleParent){
        let rolePermisstionParent = await this.RolePermissionModel.query().where({roleId: role.id}) || [];
        let idPer = rolePermisstionParent.map(item => item.permissionId);
        permissions = await this.Model.query().whereNot({key : 'root'}).whereIn("id", idPer) 
      }else {
        let rolePermisstionParent = await this.RolePermissionModel.query().where({roleId:roleParent.id}) || [];
        let idPer = rolePermisstionParent.map(item => item.permissionId);
        permissions = await this.Model.query().whereNot({key : 'root'}).whereIn("id", idPer) 
      }
    }
    for (let index in permissions) {
      let permission = permissions[index]
      let result = await permission.$relatedQuery('rolePermission').where('roleId', role.id).first()
      if (result) permissions[index]['currentValue'] = result.value
      else permissions[index]['currentValue'] = 0
    }

    role['permissions'] = permissions

    return [role]
  }


  async getPermissionByTenantId() {
    const { auth } = this.request
    const allowFields = {
      code : "string"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let user = await this.UserModel.getOne({ id: auth.id});
    logger.info(`View Per [usernameView:${user.email}] `)
    let role;
    if(params.code){
      role = await this.RoleModel.getOne({ code: params.code });
    }else {
      role = await this.RoleModel.getOne({ id: user.roleId });
    }
    let permissions = []
    if(role.key  == roleKey.root){
      permissions = await this.Model.query().whereNot({key : 'root'})
    }
    else if(role.key == roleKey.admin){
      permissions = await this.Model.query().whereNot({key : 'root'})
    }
    else {
      let roles = await this.RoleModel.query().where("tenantId", user.tenantId);
      if (!roles || !roles.length) {
        logger.error(`Critical:View Per ERR: User role doesn't exist!`);
        throw new ApiException(6000, "User role doesn't exist!")
      }
      let rolePermisstionParent = await this.RolePermissionModel.query().whereIn('roleId',roles.map(item => item.id)) || [];
      let idPer = rolePermisstionParent.map(item => item.permissionId);
      permissions = await this.Model.query().whereNot({key : 'root'}).whereIn("id",[...new Set(idPer)]) 
    }

    for (let index in permissions) {
      if(role.key  != roleKey.root){
        let permission = permissions[index]
        let results = await permission.$relatedQuery('rolePermission')
        .leftJoin('roles', 'role_permissions.roleId', 'roles.id')
        .leftJoin('tenants', 'roles.tenantId', 'tenants.id')
        .where('tenants.id', user.tenantId)
        if(results && Array.isArray(results) && results.length > 0){
          let max = 0;
          for(let result of results){
            if(result.value > max){
              max = result.value;
            }
          }
          permissions[index]['value'] = max
        }
        else if(results && !Array.isArray(results)){
          permissions[index]['value'] = results.value
        }
        else {
          permissions[index]['value'] = 0
        }
        if((permission.key == 'documents_Approval_reject_ad' || permission.key == 'documents_Approval_reject_em') && role.key == roleKey.admin){
          permissions[index]['value'] = 16
        }
      }
      permissions[index]['currentValue'] = 0
    }

    role['permissions'] = permissions

    return [role]
  }
}
