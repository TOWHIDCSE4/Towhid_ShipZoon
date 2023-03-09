import Logger from "@core/Logger";
import auth, { AuthInterface } from "@src/helpers/auth";
import ApiException from "@app/Exceptions/ApiException";

interface InvoiceInfor {
  id: number;
  invoiceName: string;
  partner_id: number;
  invoice_date: Date;
  monthly_consumption_id: number;
  amount_total: number;
  invoice_report_url: string;
}

const jsonResponse = [
  {
    id: 593,
    invoiceName: "/",
    partner_id: 147,
    invoice_date: "2023-01-29",
    monthly_consumption_id: 11,
    amount_total: 100000.0,
    invoice_report_url:
      "http://localhost:8040/abcdb_bsez_2_jan_2023%a/draftinvoice-594-594/monthly/idp/invoice",
  },
  {
    id: 594,
    invoiceName: "/",
    partner_id: 594,
    invoice_date: "2023-01-29",
    monthly_consumption_id: 12,
    amount_total: 500000.0,
    invoice_report_url: "https://www.africau.edu/images/default/sample.pdf",
  },
];

class ErpInvoice {
  static async index() {
    // let requestOptions = {
    //   headers: {
    //     Authorization: "token",
    //   },
    // };
    // const callErp = await fetch("", {
    //   method: "post",
    //   body: JSON.stringify({ key }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // let jsonResponse = await callErp.json()
    // if (!jsonResponse.length) throw new ThirdPartyException('Cannot connect to ERP')

    return jsonResponse;
  }

  static async detail(id: number) {
    return jsonResponse.find((j) => j.id == id);
  }
}

export default ErpInvoice;
