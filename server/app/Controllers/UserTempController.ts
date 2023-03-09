import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import RoleModel from "@app/Models/RoleModel";
import ApiException from "@app/Exceptions/ApiException";
import { removeVietnameseTones, hashNumber, makeKey } from "@helpers/utils";
import TenantsModel from "@app/Models/TenantsModel";
import Logger from "@core/Logger";
import redis from "../Services/Redis";
import Auth from "@root/server/libs/Auth";
import authConfig from "@config/auth";
import MailService from "@root/server/app/Services/Mail";
import Storage from '@app/Services/Storage';
import storage from "@config/storage";
import moment from 'moment-timezone';
const logger = Logger("UserTemp");

export default class AdminController extends BaseController {
  Model: typeof UserModel = UserModel;
  RoleModel: any = RoleModel;
  TenantsModel: any = TenantsModel;


  // async index() {
  //   const { auth } = this.request;
  //   let inputs = this.request.all();
  //   let project = [
  //     "user_temps.email",
  //     "user_temps.roleId",
  //     "user_temps.id",
  //     "tenants.name as tenantName",
  //     "roles.name as roleName",
  //     "user_temps.createdAt",
  //   ];

  //   let role = await this.RoleModel.getById(auth.roleId);
  //   let query = this.Model.query()
  //     .leftJoin("user_temps as ag", "user_temps.createdBy", "ag.id")
  //     .leftJoin("roles", "user_temps.roleId", "roles.id")
  //     .leftJoin("tenants", "user_temps.tenantId", "tenants.id")
  //     .whereNot("user_temps.id", auth.id);

  //   let result = await query.select(project).getForGridTable(inputs);
  //   return result;
  // }

  // async detail() {
  //   const { auth } = this.request;
  //   const allowFields = {
  //     id: "string!",
  //   };
  //   let inputs = this.request.all();
  //   let userTemp = await this.Model.query().where("id", auth.id).first();
  //   logger.info(`View Detail [usernameView:${userTemp.email}] `);
  //   let params = this.validate(inputs, allowFields, {
  //     removeNotAllow: true,
  //   });
  //   let result = await this.Model.getOne({ code: params.id });
  //   if (!result) {
  //     logger.error(`Critical:Show detail user ERR: user doesn't exist!`);
  //     throw new ApiException(6000, "user doesn't exist!");
  //   }
  //   logger.info(
  //     `Show detail user [usernameView:${userTemp.email
  //     },username:${JSON.stringify(result)}] `
  //   );
  //   return result;
  // }

  makeUserTempLink(user) {
    let token = Auth.generateJWT(
      {
        id: user.id,
        email: user.email,
      },
      {
        key: authConfig["SECRET_KEY"],
        expiresIn: authConfig["JWT_EXPIRE_UPDATE_USER_INFO"],
      }
    );
    redis.set(
      `UserTemp:${user.id}`,
      `${token}`,
      "EX",
      authConfig["JWT_EXPIRE_UPDATE_USER_INFO"]
    );
    return `${this.request.get("origin")}/user-temp/${token}`;
  }

  async store() {
    const { auth } = this.request;
    let inputs = this.request.all();
    const allowFields = {
      password: "string!",
      roleId: "number!",
      email: "string!",
      twofa: "boolean",
      tenantId: "number"
    }
    let userInfo = this.validate(inputs, allowFields, { removeNotAllow: true });
    let twofa = typeof userInfo.twofa === 'undefined' ? 0 : userInfo.twofa ? 1 : 0;

    let user = await this.Model.query().where("id", auth.id).first();

    let emailExist = await this.Model.findExist(inputs.email, "email");
    if (emailExist) throw new ApiException(6021, "Email already exists!");

    let role = await this.RoleModel.getById(inputs.roleId);
    if (!role) throw new ApiException(6000, "User role not exists!");
    let password = await this.Model.hash(inputs["password"]);
    let twofaKey = makeKey(32);

    do {
      twofaKey = makeKey(32);
    } while (!!(await UserModel.getOne({ twofaKey: twofaKey })));

    let params = {
      ...userInfo,
      password,
      twofa,
      twofaKey,
      isFirst: 1,
      Active_status: 0,
      tenantId: userInfo.tenantId?userInfo.tenantId: user.tenantId,
      createdBy: auth.id,
    };
    try {
      let result = await this.Model.insertOne(params);
      delete result["password"];
      //sent email
      let variables = {
        userTempLink: this.makeUserTempLink(result),
        email: result.email,
      };
  
      let subject = "KDDI — Create new user information";
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
          <h2>Create new user information</h2>
          <br />
        <div style="text-align:left;padding: 5px;"> 
          Welcome ${userInfo.email} ,your account has been created.Please click this link and enter your information to active your account.<br />  
          <a href="${variables.userTempLink}">click this link</a> <br/>
          After submit successfully, please use your email and given password to login the system <br/>
          <h3 style="font-weight: bold"> Your password: ${inputs.password}</h3><br/> 
          <h3 style="font-weight: bold">*Important: Please change your password after login successfully </h3> <br/>
          Best regards
          </div>
        </div>
      </div>`;
      MailService.send(variables.email, subject, content, variables);
      let code = hashNumber(String(result.id));
      let resultUpdate = await this.Model.updateOne(result.id, { code: code });
      delete resultUpdate["password"];
      return resultUpdate;
    } catch (error) {
      return error;
    }

  }

  async update() {
    let inputs = this.request.all();
    const { auth } = this.request;
    const allowFields = {
      id: "string!",
      password: "string!",
      roleId: "number!",
      email: "string!",
      twofa: "boolean",
      tenantId: "number"
    }
    let userTemp = await this.Model.getById(auth.id);
    logger.info(`Update user [username:${userTemp.email}] `);
    let params = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    const { id } = params;
    delete params.id;

    let exist = await this.Model.query().where("code", id).andWhere("Active_status", 0).first();
    if (!exist) {
      throw new ApiException(6006, "User doesn't exists!");
    }

    let emailExist = await this.Model.getOne({ email: params.email });
    if (emailExist && emailExist.id !== exist.id) {
      throw new ApiException(6021, "Email already exists!");
    }

    let result = await this.Model.updateOne(id, { ...params });
    delete result["password"];
    return {
      result,
      old: exist,
    };
  }

  async updateUserTemp() {
    let data = this.request.all();
    const allowFields = {
      token: "string!",
      firstName: "string!",
      lastName: "string!",
      phone: "number!",
      birthday: "date!",
      gender: "string!",
      commuteMethod: "string",
      marriedStatus: "string",
    }
    let params = this.validate(data, allowFields, { removeNotAllow: true });
    let { token } = params
    let oldToken
    await redis.get(`${token}`).then(res => {
      oldToken = res
    })
    if (oldToken){
      logger.error(`Critical:Check reset Password ERR: Token has expired`);
      return { error: "Token has expired" }
    } 
    delete params.token
    let user = await Auth.decodeJWT(token, {
      key: authConfig["SECRET_KEY"],
    });
    let userTemp = await this.Model.query().where("id",user.id).first();
    if (!userTemp) throw new ApiException(6000, "User doesn't exist!");
    let tenant = await this.TenantsModel.query().findById(userTemp.tenantId);
    if (!tenant) throw new ApiException(6028, "Tenant doesn't exist!");


    let { files } = this.request;
    let emailIndex = userTemp.email.indexOf('@');
    let emailName = userTemp.email.substring(0, emailIndex);

    let directory = storage.FILE_PATH + `/avatar/${tenant ? removeVietnameseTones(tenant.name) : 'default'}/${removeVietnameseTones(emailName)}`;
    let fieldnameFile = []

    for (let file of files) {
      let nameTolower = file.originalname.split('.')
      nameTolower[nameTolower.length - 1] = nameTolower[nameTolower.length - 1].toLowerCase()
      let nameOldLowerCase = String(moment().unix()) + nameTolower.join('.')
      fieldnameFile.push({
        link: `${directory}/${nameOldLowerCase}`.replace('./public', ''),
      })
      try {
        Storage.saveToDisk({
          directory,
          data: file,
          fileName: nameOldLowerCase,
          overwrite: true,
          size: 5242880, //5mb
          type: ['png', 'jpg', 'jpeg']
        })
      } catch (uploadErr) {
        throw new ApiException(uploadErr.code, uploadErr.message)
      }
    }
    params = {
      ...params,
      Active_status: 1,
      photo: fieldnameFile.length ? fieldnameFile[0].link : null
    }
    let result = await UserModel.query().where('id',userTemp.id).update(params);
    logger.info(
      `Create user [username:${user.email},userCreted:${JSON.stringify(
        result
      )}] `
    );


    let TimeExp = 86400
    redis.set(`${token}`, `${token}`, "EX", TimeExp.toFixed())
    return
  }

  // async destroy() {
  //   const { auth } = this.request;
  //   let params = this.request.all();
  //   let id = params.id;
  //   if (!id) throw new ApiException(9996, "ID is required!");

  //   let exist = await this.Model.getById(id);
  //   if (!exist) { throw new ApiException(6006, "User doesn't exists!"); }
  //   if ([id].includes(auth.id))
  //     throw new ApiException(6022, "You can not remove your account.");

  //   let user = await this.Model.query().where("id", params.id).first();
  //   await user.$query().delete();
  //   let userAuth = await this.Model.getById(auth.id);
  //   logger.info(
  //     `Destroy user [username:${userAuth.email},userDelete:${JSON.stringify(
  //       user
  //     )}] `
  //   );
  //   return {
  //     message: `Delete successfully`,
  //     old: user,
  //   };
  // }

  // async delete() {
  //   const { auth } = this.request;
  //   const allowFields = {
  //     ids: ["number!"],
  //   };
  //   const inputs = this.request.all();
  //   let params = this.validate(inputs, allowFields);

  //   let exist = await this.Model.query().whereIn("id", params.ids);
  //   if (!exist || exist.length !== params.ids.length) { throw new ApiException(6006, "User doesn't exists!"); }
  //   if (params.ids.includes(auth.id)) {
  //     logger.error(
  //       `Critical:User delete ERR: You can not remove your account!`
  //     );
  //     throw new ApiException(6022, "You can not remove your account.");
  //   }

  //   let users = await this.Model.query().whereIn("id", params.ids);
  //   for (let user of users) {
  //     await user.$query().delete();
  //   }
  //   let userAuth = await this.Model.getById(auth.id);
  //   logger.info(
  //     `Delete user [username:${userAuth.email
  //     },listUserDelete:${JSON.stringify(users)}] `
  //   );
  //   return {
  //     old: {
  //       usernames: (users || []).map((user) => user.email).join(", "),
  //     },
  //   };
  // }
}