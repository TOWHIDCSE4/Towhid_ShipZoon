import Base from "./baseService";

class documentTemplateService extends Base {
  index = async (filter: any) => {
    return this.request({
      url: "/api/v1/document_templates",
      method: "GET",
      data: filter,
    });
  };

  getTemplate = async (filter: any) => {
    return this.request({
      url: "/api/v1/document_templates/getTemplate",
      method: "GET",
      data: filter,
    });
  };

  getTemplateDetail = async (data: any) => {
    return this.request({
      url: "/api/v1/document_templates/getTemplateDetail/:id",
      method: "GET",
      data: data,
    });
  };

  activeDeative = async (data: any) => {
    return this.request({
      url: "/api/v1/document_templates/activeDeative/:id",
      method: "POST",
      data: data,
    });
  };
  
  create = async (data: any) => {
    return this.request({
      url: "/api/v1/document_templates",
      method: "POST",
      data: data,
    });
  };

  detail = async (data: any) => {
    return this.request({
      url: "/api/v1/document_templates/:id",
      method: "GET",
      data: data,
    });
  };

  edit = async (data: any) => {
    return this.request({
      url: "/api/v1/document_templates/:id",
      method: "PUT",
      data: data,
    });
  };

  delete = async (data: any) => {
    return this.request({
      url: "/api/v1/document_templates",
      method: "DELETE",
      data: data,
    });
  };

  destroy = async (data: any) => {
    return this.request({
      url: "/api/v1/document_templates/:id",
      method: "DELETE",
      data: data,
    });
  };

  select2 = async () => {
    return this.request({
      url: "/api/v1/document_templates/select2",
      method: "GET",
    });
  }
}

export default () => new documentTemplateService();