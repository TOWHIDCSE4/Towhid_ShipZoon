import BaseController from './BaseController'
import constantConfig from '@config/constant'
import _, { result } from 'lodash'
const { roleKey ,stateForm } = constantConfig
import ErpInvoice from '@app/Services/ErpInvoice/index'

export default class InvoiceController extends BaseController {
  async index() {
    const value = this.request.all()
    let { filters } = value

    let data = await ErpInvoice.index()
    if (!data.length) return [];
    if (filters && filters.length) {
      for (let filter of filters) {
        filter = JSON.parse(filter);
        switch (filter.operator) {
          case "contains": {
            data = data.filter((rs) =>
              String(rs[filter["field"]]).includes(filter["value"])
            );
            break;
          }
          case "startWiths": {
            data = data.filter((rs) =>
              String(rs[filter["field"]]).startsWith(filter["value"])
            );
            break;
          }
          case "endWiths": {
            data = data.filter((rs) =>
              String(rs[filter["field"]]).endsWith(filter["value"])
            );
            break;
          }
        }
      }
    }
    return data;
  }

  async detail() {
    
    const allowFields = {
      id: "string!"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let { id } = params;

    let result = await ErpInvoice.detail(id)
    return result
  }

}
