import dynamic from "next/dynamic";
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import { Button, Tag, Dropdown, Badge } from "antd";
import documentService from "@root/src/services/documentService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import auth from "@src/helpers/auth";
import React, { useState, useRef,useEffect } from "react";
import useBaseHook from "@src/hooks/BaseHook";
import DocumentTemplate from "@src/config/DocumentTemplate";
import { FilePdfOutlined, FileTextOutlined, MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import useStatusCount from "@root/src/hooks/StatusCount";
import { confirmDialog } from "@src/helpers/dialogs";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Index = () => {
  const user = auth().user;
  const { t, notify, redirect } = useBaseHook();
  const tableRef = useRef(null);
  const status = useStatusCount();
  const [filterSelect, setFilterSelect] = useState(null);

  const columns = [
    {
      title: t("pages:documents.table.name"),
      dataIndex: "name",
      key: "documents.name",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documents.table.issuedBy"),
      dataIndex: "tenantName",
      key: "tenants.name",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documents.table.issuedDate"),
      dataIndex: "createdAt",
      key: "documents.createdAt",
      sorter: true,
      filterable: true,
      render: (text: string, record: any) =>
        text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "",
      renderFilter: ({ column, confirm, ref }: FilterParam) => (
        <FilterDatePicker column={column} confirm={confirm} ref={ref} />
      ),
    },
    {
      title: t("pages:documents.table.submitter"),
      dataIndex: "createdByName",
      key: "users.firstName",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documents.table.status"),
      dataIndex: "status",
      key: "documents.status",
      sorter: true,
      filterable: true,
      render: (text: number, record: any) => {
        if (record.status == 3 && user.id != record.createdBy) {
          return (
            <Tag color={DocumentTemplate.documentStatusColor[2]}>
              {DocumentTemplate.documentStatus[2]}
            </Tag>
          );
        }
        return (
          <Tag color={DocumentTemplate.documentStatusColor[record.status]}>
            {DocumentTemplate.documentStatus[record.status]}
          </Tag>
        );
      },
    },
    {
      title: t("pages:documents.table.updatedAt"),
      dataIndex: "updatedAt",
      key: "documents.updatedAt",
      sorter: true,
      filterable: true,
      render: (text: string, record: any) =>
        text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "",
      renderFilter: ({ column, confirm, ref }: FilterParam) => (
        <FilterDatePicker column={column} confirm={confirm} ref={ref} />
      ),
    },
    {
      title: t("pages:action"),
      key: "action",
      render: (text, record) => {
        return (
          <div onClick={e => {
            e.stopPropagation();
          }} style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            {/* <a >
              <FilePdfOutlined />
              { t("buttons:pdf")}
            </a> */}
            {
              record.status == 1 && user.id == record.createdBy && (
                <a onClick={() => {
                  confirmDialog({
                    title:  t("pages:confirmDialog.documents.delete.title"),
                    icon: <DeleteOutlined style={{ color: 'red' }} />,
                    content: t("pages:confirmDialog.documents.delete.description"),
                    onOk: () => { onDeleteOne({ id: record.id }) },
                    okText: t("buttons:delete"),
                    okButtonProps: { danger: true },
                  });
                }}>
                  <DeleteOutlined />
                  { t("buttons:delete")}
                </a>
              )
            }
          </div>
        );
      },
    },
  ];

  const fetchData = async (values: any) => {
    if (!values.sorting.length) {
      values.sorting = [{ field: "documents.id", direction: "desc" }];
    }
    let params = {
      ...values,
      status: filterSelect,
    }
    for (let key in params) if (!params[key]) delete params[key];
    let [error, documents]: [any, any[]] = await to(
      documentService().withAuth().index(params)
    );
    if (error) {
      const { code, message } = error;
      notify(t(`errors:${code}`), t(message), "error");
      return {};
    }
    return documents;
  };

  useEffect(() => {
    tableRef?.current?.reload();
  },[filterSelect])

  const onDeleteOne = async ({ id }): Promise<void> => {
    let [error, result]: any[] = await to(documentService().withAuth().destroy({ id: id }));
    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t('messages:message.recordDocumentsDraftDeleted'))
    if (tableRef.current !== null) {
      tableRef.current.reload()
    }
  }

  return (
    <>
      <div className="content">
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <div style={{ float: 'right' }}>
            <Button onClick={() => {
              setFilterSelect(null)
              // tableRef.current.reload();
            }} >
              <Badge count={status["total"] || 0} showZero size="small" style={{ marginRight: 5, backgroundColor: '#dbdada', color: '#000' }} />
              {t("pages:documents.index.All")}
            </Button>
            <Button onClick={() => {
              setFilterSelect(3)
              // tableRef.current.reload();
            }} >
              <Badge count={status["To Be Reviewed"] || 0} showZero color='#faad14' size="small" style={{ marginRight: 5 }} />
              {t("pages:documents.index.To_Be_Reviewed")}
            </Button>
            <Button onClick={() => {
              setFilterSelect(1000)
              // tableRef.current.reload();
            }}>
              <Badge count={status["Approve"] || 0} showZero color='#52c41a' size="small" style={{ marginRight: 5 }} />
              {t("pages:documents.index.Complete")}
            </Button>
          </div>
        </div>
        <br />
        <GridTable
          ref={tableRef}
          columns={columns}
          fetchData={fetchData}
          addIndexCol={false}
          onRow={(record, rowIndex) => {
            if (record.status == 1) {
              return {
                onClick: event => { redirect("frontend.admin.documents.detailDraft", { id: record.code }) }, // click row
              };
            } else {
              return {
                onClick: event => { redirect("frontend.admin.documents.detail", { id: record.code }) }, // click row
              };
            }
          }}
        />
      </div>
    </>
  );
};

Index.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:documents.index.title")}
      description={t("pages:documents.index.description")}
      {...props}
    />
  );
};

Index.permissions = {
  documents: "R",
};

export default Index;
