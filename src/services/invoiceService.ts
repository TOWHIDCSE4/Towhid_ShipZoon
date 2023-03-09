import Base from "./baseService";

class invoiceService extends Base {
  index = async (data: any) => {
    return this.request({
      url: "/api/v1/invoices",
      method: "GET",
      data: data,
    });
  };

  detail = async (data: any) => {
    return this.request({
      url: "/api/v1/invoices/:id",
      method: "GET",
      data: data,
    });
  };
}

export default () => new invoiceService();