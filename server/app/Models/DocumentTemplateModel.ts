import BaseModel from './BaseModel'

class DocumentTemplateModel extends BaseModel {
  static tableName = "document_templates";

	//fields
	id: number;
	name: string;
	code: string;
	description: string;
	Active_status: number;
	content: Array<string>;
	locale: string;
	others: any;
	createdBy: number;
	updatedBy: number;
	createdAt: Date;
	updatedAt: Date;
}
export default DocumentTemplateModel
