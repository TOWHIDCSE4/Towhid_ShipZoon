import BaseController from './BaseController'
import DocumentModel from '@root/server/app/Models/DocumentModel'
import UserModel from '@root/server/app/Models/UserModel'
import TenantsModel from '@root/server/app/Models/TenantsModel'
import DocumentTemplateModel from '@root/server/app/Models/DocumentTemplateModel'
import RolePermissionModel from '@root/server/app/Models/RolePermissionModel'
import RoleModel from '@root/server/app/Models/RoleModel'
import ApiException from '@app/Exceptions/ApiException'
import constantConfig from '@config/constant'
import { removeVietnameseTones,hashNumber } from '@root/server/helpers/utils'
import _ from 'lodash'
const { roleKey ,stateForm } = constantConfig
import Storage from '@app/Services/Storage';
import storage from "@config/storage";
import moment from 'moment-timezone';


export default class DocumentController extends BaseController {
  Model: any = DocumentModel
  UserModel: any = UserModel
  DocumentTemplateModel: any = DocumentTemplateModel
  TenantsModel: any = TenantsModel
  RolePermissionModel: any = RolePermissionModel
  RoleModel : any = RoleModel

  async index() {
    const data = this.request.all()
    const { auth } = this.request;
    let allowFields = {
      status: "number",
    }
    let params = this.validate(data, allowFields, { removeNotAllows: true });
    const { status } = params;

    let project = ['documents.*','users.lastName as createdByName','tenants.name as tenantName']
    let user = await this.UserModel.query()
    .leftJoin('roles', 'users.roleId', 'roles.id')
    .where('users.id',auth.id)
    .select(['users.*','roles.key as role']).first()



    let query = this.Model.query()
    .leftJoin('users', 'documents.createdBy', 'users.id')
    .leftJoin('tenants', 'users.tenantId', 'tenants.id')
    let parentRole = await this.RoleModel.getLastParent(user.roleId)


    if (status && status == 1000) query.whereIn("documents.status", [4,5]);
    else if (status && status != 1000) query.where("documents.status", status);
    if(!(parentRole.key  == roleKey.admin) && !(user.role == roleKey.root)){
      query.where('documents.createdBy',user.id)
    }

    if((parentRole.key  == roleKey.admin) && (user.role == roleKey.admin)){
      query.where('documents.others','@>',JSON.stringify({"statusDocumentTemplate": 2}))
      .whereNot('documents.status',1);
    }
    if((parentRole.key  == roleKey.admin) && !(user.role == roleKey.admin)){

      query.where('documents.others','@>',JSON.stringify({"statusDocumentTemplate": 1}))
      .whereNot('documents.status',1);
    }

    let result = await query
    .select(project)
    .getForGridTable(data);

    return result;
  }

  async getDocument() {
    // let inputs = this.request.all();
    // const { auth } = this.request;

    // let allowFields = {
    //   status: "number",
    // }

    // let user = await this.UserModel.query()
    // .leftJoin('roles', 'users.roleId', 'roles.id')
    // .where('users.id',auth.id)
    // .select(['users.*','roles.key as role']).first()

    // let params = this.validate(inputs, allowFields, { removeNotAllows: true });
    
    // const { status } = params;
    // let project = ['documents.*','users.lastName as createdByName','tenants.name as tenantName']
    // let query = this.Model.query()
    // .leftJoin('users', 'documents.createdBy', 'users.id')
    // .leftJoin('tenants', 'users.tenantId', 'tenants.id')
    // .select(project)


    // if (status && status == 1000) query.whereIn("documents.status", [4,5]);
    // else if (status && status != 1000) query.where("documents.status", status);
    // else query.whereNot('documents.status',1);
    // let parentRole = await this.RoleModel.getLastParent(user.roleId)

    // if(!(parentRole.key  == roleKey.admin) && !(user.role == roleKey.root)){
    //   query.where('documents.createdBy',user.id)
    // }

    // if((parentRole.key  == roleKey.admin) && (user.role == roleKey.admin)){
    //   query.where('documents.others','@>',JSON.stringify({"statusDocumentTemplate": 2}))
    // }
    // if((parentRole.key  == roleKey.admin) && !(user.role == roleKey.admin)){
    //   query.where('documents.others','@>',JSON.stringify({"statusDocumentTemplate": 1}))
    // }


    // let result = await query
    // .getForGridTable(inputs);
    // return result;
  }

  async getDocumentDraff() {
    // const data = this.request.all()
    // const { auth } = this.request;
    // let user = await this.UserModel.query()
    // .leftJoin('roles', 'users.roleId', 'roles.id')
    // .where('users.id',auth.id)
    // .select(['users.*','roles.key as role']).first()

    // let project = ['documents.*','users.lastName as createdByName','tenants.name as tenantName']
    // let query =this.Model.query().where('status',1)
    // .leftJoin('users', 'documents.createdBy', 'users.id')
    // .leftJoin('tenants', 'users.tenantId', 'tenants.id')

    // if(!(user.role == roleKey.root)){
    //   query.where('tenants.id',user.tenantId)
    // }

    // let result = await query.select(project)
    // .getForGridTable(data);
    // return result;
  }

  async detail() {
    const allowFields = {
      id: "string!"
    }
    const { auth } = this.request;
    let user = await this.UserModel.query()
    .leftJoin('roles', 'users.roleId', 'roles.id')
    .where('users.id',auth.id)
    .select(['users.*','roles.key as role']).first()

    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let { id } = params;
    let project = ['documents.*','document_templates.content as template']
    let query = this
    .Model
    .query()
    .leftJoin('document_templates', 'documents.documentTemplateId', 'document_templates.id')
    .leftJoin('users', 'documents.createdBy', 'users.id')
    .leftJoin('tenants', 'users.tenantId', 'tenants.id')
    let parentRole = await this.RoleModel.getLastParent(user.roleId)

    if(!(parentRole.key  == roleKey.admin) && !(user.role == roleKey.root)){
      query.where('tenants.id',user.tenantId)
    }

     let result =await  query.select(project)
    .where('documents.code', id)
    .first();
    if (!result) {
      throw new ApiException(7002, 'Data not found')
    }
    return result
  }


  async store() {
    let inputs = this.request.all()
    const { auth } = this.request;
    const allowFields = {
      documentTemplateId: "string!",
      statusDocumentTemplate: "number!",
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let documentTemplate = await this.DocumentTemplateModel.query().findById(data.documentTemplateId);
    if(!documentTemplate){
      throw new ApiException(6053, 'documentTemplate not found')
    }
    let user = await this.UserModel.query().findById(auth.id);
    let tenant = await this.TenantsModel.query().findById(user.tenantId);

    if (!documentTemplate) {
      throw new ApiException(6053, 'documentTemplate not found')
    }

    let contentDocumentTemplate = documentTemplate.content || [];
    let allowFieldsDocument = {};
    let listFile = []

    contentDocumentTemplate.forEach((item,index) => {
      item.GroupDefinition?.forEach((group,indexGroup) => {
        group?.FieldDefinition?.forEach((field,indexField) => {
          let requiredInput = (field?.validations || []).includes('required');
          switch (field?.inputType) {
            case "textInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "textAreaInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "numberInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "number!" : "number";
              break;
            case "dateTimeInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "dateTimeShowTimeInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "selectInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "fileInput":
              listFile.push(field?.fieldName)
              break;
            case "checkboxInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "boolean!" : "boolean";
              break;
            case "radioInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "tableInput":
              let fieldValidate = {
                key: "string"
              }
              field?.tableSelect?.forEach((item,index) => {
                fieldValidate[item.dataIndex] = requiredInput? "string!" : "string";
              })
              allowFieldsDocument[field?.fieldName] = [fieldValidate];
              break;
          }
        })
      })
    })
    let conentData = this.validate(inputs, allowFieldsDocument, { removeNotAllow: true });
    let { files } = this.request;
    let directory = storage.FILE_PATH + `/${tenant?removeVietnameseTones(tenant.name):'default'}/${removeVietnameseTones(user.email)}`;
    let fieldnameFile = []

    for (let file of files) {
      let nameTolower = file.originalname.split('.')
      nameTolower[nameTolower.length - 1] = nameTolower[nameTolower.length - 1].toLowerCase()
      let nameOldLowerCase = String(moment().unix()) + nameTolower.join('.')
      let type = [nameTolower[nameTolower.length - 1]]
      fieldnameFile.push({
        fieldname: file.fieldname,
        link: `${directory}/${nameOldLowerCase}`.replace('./public', ''),
      })
      Storage.saveToDisk({
        directory,
        data: file,
        fileName: nameOldLowerCase,
        overwrite: true,
        size: 30931520, // 30mb
        type
      })
    }
    listFile.forEach((item,index) => {
      let files = fieldnameFile.map((file) => {
          let name = file?.fieldname?.slice(0,file?.fieldname?.indexOf('[fileList]'));
          if(name == item) {
            return file.link
          }
      }).filter((file) => file)
      if (files && files.length > 0) {
        conentData[item] = files
      }
    })
    let dataCreated = {
      name: documentTemplate.name,
      content: JSON.stringify(conentData),
      status: data.statusDocumentTemplate,
      others: JSON.stringify({statusDocumentTemplate: data.statusDocumentTemplate == 1 ? 0 : 1}),
      documentTemplateId: documentTemplate.id,
      createdBy: auth.id,
    }

    let result = await this.Model.query().insert(dataCreated);
    let code = hashNumber(String(result.id));
    result = await this.Model.updateOne(result.id, { code: code });
    delete result.id
    return result
  }

  async update() {
    let inputs = this.request.all()
    const { auth } = this.request;
    const allowFields = {
      id: "string!",
      statusDocumentTemplate: "number!"
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let documentDb = await this.Model.query().findById(data.id);
    if(!documentDb){
      throw new ApiException(6052, 'document not found')
    }
    let documentTemplate = await this.DocumentTemplateModel.query().findById(documentDb.documentTemplateId);
    if(!documentTemplate){
      throw new ApiException(6053, 'documentTemplate not found')
    }
    let user = await this.UserModel.query().findById(auth.id);
    let tenant = await this.TenantsModel.query().findById(user.tenantId);

    if (!documentTemplate) {
      throw new ApiException(6053, 'documentTemplate not found')
    }

    let contentDocumentTemplate = documentTemplate.content || [];
    let allowFieldsDocument = {};
    let listFile = []



    contentDocumentTemplate.forEach((item,index) => {
      item.GroupDefinition?.forEach((group,indexGroup) => {
        group?.FieldDefinition?.forEach((field,indexField) => {
          let requiredInput = (field?.validations || []).includes('required');
          switch (field?.inputType) {
            case "textInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "textAreaInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "numberInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "number!" : "number";
              break;
            case "dateTimeInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "dateTimeShowTimeInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "selectInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "fileInput":
              listFile.push(field?.fieldName)
              break;
            case "checkboxInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "boolean!" : "boolean";
              break;
            case "radioInput":
              allowFieldsDocument[field?.fieldName] = requiredInput? "string!" : "string";
              break;
            case "tableInput":
              let fieldValidate = {
                key: "string"
              }
              field?.tableSelect?.forEach((item,index) => {
                fieldValidate[item.dataIndex] = requiredInput? "string!" : "string";
              })
              allowFieldsDocument[field?.fieldName] = [fieldValidate];
              break;
          }
        })
      })
    })


    let conentData = this.validate(inputs, allowFieldsDocument, { removeNotAllow: true });
    let { files } = this.request;
    let directory = storage.FILE_PATH + `/${tenant?removeVietnameseTones(tenant.name):'default'}/${removeVietnameseTones(user.email)}`;
    let fieldnameFile = []

    for (let file of files) {
      let nameTolower = file.originalname.split('.')
      nameTolower[nameTolower.length - 1] = nameTolower[nameTolower.length - 1].toLowerCase()
      let nameOldLowerCase = String(moment().unix()) + nameTolower.join('.')
      let type = [nameTolower[nameTolower.length - 1]]
      fieldnameFile.push({
        fieldname: file.fieldname,
        link: `${directory}/${nameOldLowerCase}`.replace('./public', ''),
      })
      Storage.saveToDisk({
        directory,
        data: file,
        fileName: nameOldLowerCase,
        overwrite: true,
        size: 30931520, // 30mb
        type
      })
    }
    listFile.forEach((item,index) => {
      let files = fieldnameFile.map((file) => {
          let name = file?.fieldname?.slice(0,file?.fieldname?.indexOf('[fileList]'));
          if(name == item) {
            return file.link
          }
      }).filter((file) => file)
      let listFileOld = []
      if(Array.isArray(inputs[item])){
        listFileOld = inputs[item]?.filter(item => item.url).map(item => {
          return item.url.replace(`${storage.DOMAIN}`, '')
        }) || []
      }else {
        listFileOld = inputs[item]?.fileList?.filter(item => item.url).map(item => {
          return item.url.replace(`${storage.DOMAIN}`, '')
        }) || []
      }
      if ((files && files.length > 0) || (listFileOld && listFileOld.length > 0)) {
        conentData[item] = [...files,...listFileOld]
      }
    })
    let dataUpdate = {
      content: JSON.stringify(conentData),
      status: data.statusDocumentTemplate,
      others: JSON.stringify({statusDocumentTemplate: data.statusDocumentTemplate == 1 ? 0 : 1}),
      documentTemplateId: documentTemplate.id,
      createdBy: auth.id,
    }
    let result = await this.Model.updateOne(documentDb.id, dataUpdate);
    return result
  }


  async destroy() {
    const allowFields = {
      id: "string!"
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    const { auth } = this.request;
    let user = await this.UserModel.getById(auth.id)

    let document = await this.Model
    .leftJoin('users', 'documents.createdBy', 'users.id')
    .leftJoin('tenants', 'users.tenantId', 'tenants.id')
    .where('tenants.id', user.tenantId)
    .getOne({ id: params.id });

    if(!document) throw new ApiException(6052, "Document not found!")
    if(document.status != 1) throw new ApiException(6054, "Document has been approved cannot be deleted!")

    let result = await this.Model.query().where('id', document.id).del();
    return result
  }

  async delete() {
    const allowFields = {
      ids: ["number!"]
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);
    const { auth } = this.request;
    let user = await this.UserModel.getById(auth.id)
    let documents = await this.Model.query()
    .leftJoin('users', 'documents.createdBy', 'users.id')
    .leftJoin('tenants', 'users.tenantId', 'tenants.id')
    .where('tenants.id', user.tenantId)
    .whereIn('id', params.ids);
    if (documents.length !== params.ids.length) throw new ApiException(6052, "Document not found!")
    for(let document of documents) {
      if(document.status != 1) throw new ApiException(6054, "Document has been approved cannot be deleted!")
    }

    await this.Model.deleteByIds(documents.map(item => item.id));
    return 
  }

  async approve(){
    let inputs = this.request.all()
    const { auth } = this.request;
    let user = await this.UserModel.getById(auth.id)
    let roleApprove = await this.RolePermissionModel.query().where('role_permissions.roleId', user.roleId).whereIn('role_permissions.key', ['documents_Approval_reject_ad','documents_Approval_reject_em'])
    if(!roleApprove.length) throw new ApiException(6051, "You do not have permission to approve this document!")


    const allowFields = {
      id: "string!",
      comment_Your_Comments_Basic: "string",
      comment_Tenant_Admin_Comments_Basic: "string",
      comment_Issuer_Comments_Basic: "string",
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let document = await this.Model.getOne({ code: data.id });
    if(!document) throw new ApiException(6052, "Document not found!")
    let state = document.others.statusDocumentTemplate || null
    if(!state) throw new ApiException(6051, "Document has been approved cannot be approved!")
    if(state == stateForm.length - 3 && !roleApprove.find(item => item.key == 'documents_Approval_reject_em' || item.key == 'root')) throw new ApiException(6051, "You do not have permission to approve this document!")
    if(state == stateForm.length - 2 && !roleApprove.find(item => item.key == 'documents_Approval_reject_ad' || item.key == 'root')) throw new ApiException(6051, "You do not have permission to approve this document!")

    let nextState = state + 1
    if(nextState > stateForm.length - 1) throw new ApiException(6051, "Document has been approved cannot be approved!")
    delete data.id
    let others = {
      ...document.others,
      ...data,
      statusDocumentTemplate: nextState,
    }
    let status = nextState == stateForm.length - 1 ? 5 : 3
    let result = await this.Model.updateOne(document.id, {status, others: JSON.stringify(others)});
    return result
  }

  async reject(){
    let inputs = this.request.all()
    const { auth } = this.request;
    let user = await this.UserModel.getById(auth.id)
    let roleReject = await this.RolePermissionModel.query().where('role_permissions.roleId', user.roleId).whereIn('role_permissions.key', ['documents_Approval_reject_ad','documents_Approval_reject_em'])
    if(!roleReject.length) throw new ApiException(6055, "You do not have permission to reject this document!")
    const allowFields = {
      id: "string!",
      comment_Your_Comments_Basic: "string",
      comment_Tenant_Admin_Comments_Basic: "string",
      comment_Issuer_Comments_Basic: "string",
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let document = await this.Model.getOne({ code: data.id });
    if(!document) throw new ApiException(6052, "Document not found!")
    let state = document.others.statusDocumentTemplate || null
    if(!state) throw new ApiException(6055, "Document has been approved cannot be approved!")
    if(state == stateForm.length - 3 && !roleReject.find(item => item.key == 'documents_Approval_reject_em' || item.key == 'root')) throw new ApiException(6043, "You do not have permission to reject this document!")
    if(state == stateForm.length - 2 && !roleReject.find(item => item.key == 'documents_Approval_reject_ad' || item.key == 'root')) throw new ApiException(6043, "You do not have permission to reject this document!")
    if(state == stateForm.length - 1) throw new ApiException(6055, "Document has been approved cannot be approved!")
    delete data.id
    let others = {
      ...document.others,
      ...data,
      statusDocumentTemplate: 1,
    }
    let status = 4
    let result = await this.Model.updateOne(document.id, {status, others: JSON.stringify(others)});
    return result
  }

}
