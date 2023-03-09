import Base from "./baseService";

class documentsService extends Base {
  index = async (filter: any) => {
    return this.request({
      url: "/api/v1/documents",
      method: "GET",
      data: filter,
    });
  };

  getDocument = async (filter: any) => {
    return this.request({
      url: "/api/v1/documents/getDocument",
      method: "GET",
      data: filter,
    });
  };

  getDocumentDraff = async (filter: any) => {
    return this.request({
      url: "/api/v1/documents/getDocumentDraff",
      method: "GET",
      data: filter,
    });
  };

  create = async (data: any) => {
    return this.request({
      url: "/api/v1/documents",
      method: "POST",
      data: data,
      options: {
        allowUpload: true
      }
    });
  };

  detail = async (data: any) => {
    return this.request({
      url: "/api/v1/documents/:id",
      method: "GET",
      data: data,
    });
  };

  approve = async (data: any) => {
    return this.request({
      url: "/api/v1/documents/approve",
      method: "POST",
      data: data,
    });
  }

  reject = async (data: any) => {
    return this.request({
      url: "/api/v1/documents/reject",
      method: "POST",
      data: data,
    });
  }

  edit = async (data: any) => {
    return this.request({
      url: "/api/v1/documents/:id",
      method: "PUT",
      data: data,
      options: {
        allowUpload: true
      }
    });
  };

  delete = async (data: any) => {
    return this.request({
      url: "/api/v1/documents",
      method: "DELETE",
      data: data,
    });
  };

  destroy = async (data: any) => {
    return this.request({
      url: "/api/v1/documents/:id",
      method: "DELETE",
      data: data,
    });
  };
}

export default () => new documentsService();