import React, { useState, useEffect, useRef } from "react";
import FileSaver from "file-saver";
import dynamic from "next/dynamic";
import { Button, Form, Spin } from "antd";
import to from "await-to-js";
import { FilePdfOutlined } from "@ant-design/icons";
import useBaseHook from "@src/hooks/BaseHook";
import usePermissionHook from "@src/hooks/PermissionHook";
import getConfig from "next/config";
import invoiceService from "@root/src/services/invoiceService";

const { publicRuntimeConfig } = getConfig();

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Detail = () => {
  const { t, notify, redirect, router, setStore } = useBaseHook();
  const [invoice, setInvoice] = useState<Invoice>()
  const [form] = Form.useForm();
  const refIframe = useRef();
  const { query } = router
  const { checkPermission } = usePermissionHook();
  const deletePer = checkPermission({
    documents: "D",
  });
  const updatePer = checkPermission({
    documents: "U",
  });

  const fetchData = async () => {
    let idError: any = null;

    if (!query.id) {
      idError = {
        code: 9996,
        message: 'missing ID'
      }
    }
    if (idError) return notify(t(`errors:${idError.code}`), '', 'error')
    let [invoiceError, invoice]: [any, any] = await to(invoiceService().withAuth().detail({ id: query.id }));
    if (invoiceError) return notify(t(`errors:${invoiceError.code}`), '', 'error')

    setInvoice(invoice)

    return invoice;
  }

  useEffect(() => {
    fetchData()
  }, []);
  
  const urlDownload = () => {
    FileSaver.saveAs(invoice.invoice_report_url, "example.pdf")
  }

  const display = {
    display: 'flex',
    justifyContent: 'center',
  }

  if (!invoice || !invoice.invoice_report_url)
    return (
      <div className="content">
        <Spin />
      </div>
    );

  return (
    <div className="content" style={display}>
      <div style={{ width: '85%', minHeight: 'calc(100vh - 70px)'}}>
        {invoice && invoice.invoice_report_url ?
          <iframe src={invoice.invoice_report_url}
            style={{ width: 'calc(100vw - 700px)', height: '100%', position: 'absolute' }}
          ></iframe>
          : <></>}
      </div>
      <div style={{width:"200px"}}>
          <Button type="primary" onClick={urlDownload} style={{marginTop:'30px'}}><FilePdfOutlined />Download</Button>
      </div>
    </div>
  );
};

Detail.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:invoices.detail.title")}
      description={t("pages:invoices.detail.description")}
      {...props}
    />
  );
};

Detail.permissions = {
  invoices: "R",
};

export default Detail;
