import dynamic from "next/dynamic";
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import { Spin, Dropdown } from "antd";
import auth from "@src/helpers/auth";
import React, { useState, useRef, useEffect } from "react";
import useBaseHook from "@src/hooks/BaseHook";
import usePermissionHook from "@src/hooks/PermissionHook";
import { FilePdfOutlined, FileTextOutlined, MoreOutlined, SearchOutlined, CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import useStatusCount from "@root/src/hooks/StatusCount";
import type { MenuProps } from 'antd';
import InvoiceStatus from "@root/src/config/InvoiceStatus";
import invoiceService from "@root/src/services/invoiceService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import type { ColumnsType, TableProps } from 'antd/es/table';

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Index = () => {
  const user = auth().user;
  const { t, notify, redirect } = useBaseHook();
  const tableRef = useRef(null);
  const status = useStatusCount();
  const { checkPermission } = usePermissionHook();
  const [data, setData] = useState([])

  const deletePer = checkPermission({
    documents: "D",
  });

  const fetchData = async (values: any) => {
    let [error, invoices]: [any, any[]] = await to(
      invoiceService().withAuth().index(values)
    );
    if (error) {
      const { code, message } = error;
      notify(t(`errors:${code}`), t(message), "error");
      return {};
    }
    setData(invoices)
    return invoices;
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a >
          <FilePdfOutlined />
          PDF
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a >
          <FileTextOutlined />
          CSV
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: t("pages:invoices.table.id"),
      dataIndex: "id",
      key: "id",
      filterable: true,
    },
    {
      title: t("pages:invoices.table.invoiceName"),
      dataIndex: "invoiceName",
      key: "invoiceName",
      filterable: true,
    },
    {
      title: t("pages:invoices.table.invoiceDate"),
      dataIndex: "invoice_date",
      key: "invoice_date",
      sorter: true,
      filterable: true,
      render: (text: string, record: any) =>
        text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "",
      renderFilter: ({ column, confirm, ref }: FilterParam) => (
        <FilterDatePicker column={column} confirm={confirm} ref={ref} />
      ),
    },
    {
      title: t("pages:invoices.table.partnerId"),
      dataIndex: "partner_id",
      key: "partner_id",
    },
    {
      title: t("pages:invoices.table.consumptionId"),
      dataIndex: "monthly_consumption_id",
      key: "monthly_consumption_id",
      // render: (text: number, record: any) => {
      //   if(record.invoicePaymentStatus == 3 && user.id != record.invoiceNo) {
      //     return (
      //       <Tag color={InvoiceStatus.statusColor[2]}>
      //         {InvoiceStatus.invoiceStatus[2]}
      //       </Tag>
      //     );}
      //   return (
      //     <Tag color={InvoiceStatus.statusColor[record.invoicePaymentStatus]}>
      //       {InvoiceStatus.invoiceStatus[record.invoicePaymentStatus]}
      //     </Tag>
      //   );
      // },
    },
    {
      title: t("pages:invoices.table.amountTotal"),
      dataIndex: "amount_total",
      key: "amount_total",
    },
    {
      title: t("pages:invoices.table.reportUrl"),
      dataIndex: "invoice_report_url",
      key: "invoice_report_url",
    },
    // {
    //   title: t("pages:invoices.table.updatedDate"),
    //   dataIndex: "updatedDate",
    //   key: "invoices.updatedDate",
    //   sorter: true,
    //   filterable: true,
    //   render: (text: string, record: any) =>
    //     text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "",
    //   renderFilter: ({ column, confirm, ref }: FilterParam) => (
    //     <FilterDatePicker column={column} confirm={confirm} ref={ref} />
    //   ),
    // },
  //   {
  //     title: t("pages:action"),
  //     key: "action",
  //       render: (text, record) => {
  //         return (
  //           <div onClick={()=>{console.log("vao day")}} style={{textAlign:'center',width:'100%',zIndex:'100'}}>
  //             <Dropdown menu={{ items }} placement="topLeft">
  //               <MoreOutlined />
  //             </Dropdown>
  //           </div>
  //         );
  //       },
  //   },
  ];
  
  // if (!data.length) return (
  //   <div className="content">
  //     <Spin />
  //   </div>
  // );

  return (
    <>
      <div className="content">
        {/* <div style={{ width: '100%', marginBottom: '20px' }}>
          <div style={{ float: 'left' }}> */}
            {/* <Button onClick={() => {
              setFilterSelect(1000)
              tableRef.current.reload();
            }}><FilterOutlined />
              More Filters
            </Button> */}
          {/* </div>
        </div> */}
        <br />
        <GridTable
          ref={tableRef}
          columns={columns}
          addIndexCol={false}
          data={data}
          total={data.length}
          fetchData={fetchData}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => { redirect("frontend.admin.invoices.detail", { id: record.id }) }, // click row
            };
          }
          }
        />
      </div>
    </>
  );
};

Index.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:invoices.index.title")}
      description={t("pages:invoices.index.description")}
      {...props}
    />
  );
};

Index.permissions = {
  invoices: "R",
};

export default Index;
