import BaseController from './BaseController'
import DocumentTemplateModel from '@root/server/app/Models/DocumentTemplateModel'
import DocumentModel from '@root/server/app/Models/DocumentModel'
import UserModel from '@root/server/app/Models/UserModel'
import ApiException from '@app/Exceptions/ApiException'
import { removeVietnameseTones,hashNumber } from '@root/server/helpers/utils'
import _ from 'lodash'

export default class DocumentTemplateController extends BaseController {
    Model: any = DocumentTemplateModel
    UserModel: any = UserModel
    DocumentModel: any = DocumentModel


  async index() {
    const data = this.request.all()
    let result = await this.Model.query().getForGridTable(data);
    return result;
  }

  async getTemplate() {
    const data = this.request.all()
    let result = await this.Model.query().where('Active_status',1).getForGridTable(data);
    return result;
  }

  async getTemplateDetail() {
    const allowFields = {
      id: "string!"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let id = params.id
    if (!id) throw new ApiException(9996, "ID is required!");
    let result = await this.Model.query().where('code', id).andWhere('Active_status',1).first();
    if (!result) {
      throw new ApiException(7002, 'Data not found')
    }
    return result
  }

  async detail() {
    const allowFields = {
      id: "string!"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let id = params.id
    if (!id) throw new ApiException(9996, "ID is required!");
    let result = await this.Model.query().where('code', id).first();
    if (!result) {
      throw new ApiException(7002, 'Data not found')
    }
    return result
  }

  async store() {
    let inputs = this.request.all()
    const { auth } = this.request;
    let {data,errorData} = this.validateInputsStore(inputs);
    if(errorData.length > 0){
      throw new ApiException(9996, "Invalid Data", errorData);
    }
    data['content'] = JSON.stringify(data['createDocumentTemplates']);
    data['createdBy'] = auth.id;
    delete data['createDocumentTemplates'];
    let result = await this.Model.insertOne(data);
    let code = hashNumber(String(result.id));
    result = await this.Model.updateOne(result.id, { code: code });
    delete result.id
    return result
  }

  async update() {
    const { auth } = this.request
    const allowFields = {
      id: "string!",
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let documentTemplate = await this.Model.query().where('code', params.id).first();
    if (!documentTemplate) {
      throw new ApiException(6501, 'DocumentTemplate not found!')
    }
    let checkDocument = await this.DocumentModel.query().where('documentTemplateId', documentTemplate.id);
    if(checkDocument && checkDocument.length){
      throw new ApiException(6045, 'Document is using this template')
    }
    let {data,errorData} = this.validateInputsStore(inputs);
    if(errorData.length > 0){
      throw new ApiException(9996, "Invalid Data", errorData);
    }
    data['content'] = JSON.stringify(data['createDocumentTemplates']);
    data['updatedBy'] = auth.id;
    delete data['createDocumentTemplates'];
    let result = await this.Model.updateOne(documentTemplate.id, { content: data['content'] });
    return result
  }

  validateInputsStore(inputs) {
    const allowFields = {
      name: "string!",
      locale: "string!",
      createDocumentTemplates: [{
        stepTitle: "string!",
        GroupDefinition: [{
          groupTitle: 'string!',
          FieldDefinition: [{
            col: {
              lg: 'number',
              md: 'number',
              sm: 'number',
              xs: 'number',
            },
            label: 'string!',
            position: 'number',
            inputType: 'string!',
            fieldName: 'string!',
            validations: ['string'],
            validationMax: 'number',
            validationTypeFileUpload: ['string'],
            validationSizeFileUpload:"number",
            validationNumberFileUpload: "number",
            typeDate: 'string',
            listSelect: {
              source: [{label: 'string', value: 'string'}],
              sourceType: 'string',
            },
            radioSelect: [{label: 'string', value: 'string'}],
            tableSelect: [{
              title: 'string', 
              dataIndex: 'string',
              validations: ['string'],
            }],
          }]
        }]
      }]
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let errorData = []

    if(!data || !data['name']){
      errorData.push({
        code: 6033,
        message: "Name is required!"
      })
    }
    if(!data || !data['locale']){
      errorData.push({
        code: 6034,
        message: "Language is required!"
      })
    }
    if(!data['createDocumentTemplates'] || !data['createDocumentTemplates'] || !data['createDocumentTemplates'].length) {
      errorData.push({
        code: 6035,
        message: "Data is required!"
      })
    }
    let checkFieldName = [];

    data['createDocumentTemplates'] = data['createDocumentTemplates']?.map((item, index) => {
      if(!item.stepTitle){
        errorData.push({
          code: 6036,
          message: "Step title is required!"
        })
      }
      if(!item.GroupDefinition || !item.GroupDefinition.length){
        errorData.push({
          code: 6037,
          message: "Group definition is required!"
        })
      }
      item.GroupDefinition = item.GroupDefinition?.map((itemGroup, indexGroup) => {
        if(!itemGroup.groupTitle){
          errorData.push({
            code: 6038,
            message: "Group title is required!"
          })
        }
        if(!itemGroup.FieldDefinition || !itemGroup.FieldDefinition.length){
          errorData.push({
            code: 6039,
            message: "Group definition is required!"
          })
        }
        itemGroup.FieldDefinition = itemGroup.FieldDefinition?.map((itemField, indexField) => {
          let removeFieldName = removeVietnameseTones(item.stepTitle) +'_'+ removeVietnameseTones(itemGroup.groupTitle) +'_'+  removeVietnameseTones(itemField.fieldName);
          checkFieldName.push(removeFieldName)
          if(!itemField.label){
            errorData.push({
              code: 6040,
              message: "Label is required!"
            })
          }
          if(!itemField.inputType){
            errorData.push({
              code: 6041,
              message: "Input type is required!"
            })
          }
          if(!itemField.fieldName){
            errorData.push({
              code: 6042,
              message: "Field name is required!"
            })
          }
          if(itemField.inputType === 'selectInput' && (!itemField.listSelect || !itemField.listSelect.source || !itemField.listSelect.source.length)){
            errorData.push({
              code: 6043,
              message: "List select is required!"
            })
          }
          if(itemField.inputType === 'radioInput' && (!itemField.radioSelect || !itemField.radioSelect.length)){
            errorData.push({
              code: 6502,
              message: "Radio select is required!"
            })
          }
          let tableSelect = []
          if(itemField.inputType === 'tableInput' && (!itemField.tableSelect || !itemField.tableSelect.length)){
            errorData.push({
              code: 6503,
              message: "Table col is required!"
            })
          }else {
            itemField.tableSelect = itemField.tableSelect?.map((itemTable, indexTable) => {
              let removeFieldNameTable = removeVietnameseTones(item.stepTitle) +'_'+ 
              removeVietnameseTones(itemGroup.groupTitle) +'_'+  
              removeVietnameseTones(itemField.fieldName) +'_'+ 
              removeVietnameseTones(itemTable.dataIndex)
              checkFieldName.push(removeFieldNameTable)
              if(!itemTable.title){
                errorData.push({
                  code: 6504,
                  message: "Table col title is required!"
                })
              }
              if(!itemTable.dataIndex){
                errorData.push({
                  code: 6505,
                  message: "Table col dataIndex is required!"
                })
              }
              return {
                ...itemTable,
                dataIndex: removeFieldNameTable,
              }
            })
          }

          return {
            ...itemField,
            fieldName: removeFieldName
          }
        })


        return {
          ...itemGroup,
        }
      })

      return {
        ...item,
      }
    })

    if(checkFieldName.length != new Set(checkFieldName).size){
      errorData.push({
        code: 6506,
        message: "Field name is duplicate!"
      })
    }
    return {data,errorData}
  }





  async destroy() {
    const allowFields = {
      id: "string!"
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let documentTemplate = await this.Model.getOne({ code: params.id });

    if(!documentTemplate) throw new ApiException(6501, "Document template not found!")

    let listdocument = await this.DocumentModel.query().where('documentTemplateId', documentTemplate.id).andWhere('Active_status',1)
    if(!_.isEmpty(listdocument)) throw new ApiException(6500, "Document template contains document cannot be deleted!")
    let result = await this.Model.deleteById(documentTemplate.id);
    return result
  }

  async activeDeative() {
    const allowFields = {
      id: "string!"
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let documentTemplate = await this.Model.getOne({ code: params.id });
    if(!documentTemplate) throw new ApiException(6501, "Document template not found!")

    // let listdocument = await this.DocumentModel.query().where('documentTemplateId', documentTemplate.id)
    // if(!_.isEmpty(listdocument)) throw new ApiException(6500, "Document template contains document cannot be deleted!")
    console.log("documentTemplate", documentTemplate)
    await this.Model.updateOne(documentTemplate.id, { Active_status : documentTemplate['Active_status']?0:1 });
    return
  }

  async delete() {
    const allowFields = {
      ids: ["number!"]
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);

    let documentTemplates = await this.Model.query().whereIn('id', params.ids).andWhere('Active_status',1);
    if (documentTemplates.length !== params.ids.length) throw new ApiException(6501, "Document template not found!")

    let listdocuments = await this.DocumentModel.query().whereIn('documentTemplateId', documentTemplates.map(item => item.id))

    if(!_.isEmpty(listdocuments)) throw new ApiException(6500, "Document template contains document cannot be deleted!")
    await this.Model.deleteByIds(documentTemplates.map(item => item.id));
    return 
  }


}
