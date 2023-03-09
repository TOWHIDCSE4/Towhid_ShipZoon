import dynamic from "next/dynamic";
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import { Button, Tag, Dropdown  ,Badge } from "antd";
import documentTemplateService from "@root/src/services/documentTemplateService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import auth from "@src/helpers/auth";
import React, { useState, useRef } from "react";
import useBaseHook from "@src/hooks/BaseHook";
import { CopyOutlined, FileTextOutlined,DeleteOutlined,PlusCircleOutlined } from "@ant-design/icons";
import usePermissionHook from "@src/hooks/PermissionHook";
import { confirmDialog } from '@src/helpers/dialogs'

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Index = () => {
  const user = auth().user;
  const { t, notify, redirect } = useBaseHook();
  const tableRef = useRef(null);
  const { checkPermission } = usePermissionHook();
  const [selectedIds, setSelectedIds] = useState([])
  const [hiddenDeleteBtn, setHiddenDeleteBtn] = useState(true)
  const languageTypes = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Vietnamese",
      value: "vi",
    },
  ];
  const createPer = checkPermission({
    "document_templates": "C"
  })
  const deletePer = checkPermission({
    "document_templates": "D"
  })
  const columns = [
    {
      title: t("pages:documentTemplates.table.name"),
      dataIndex: "name",
      key: "document_templates.name",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documentTemplates.table.description"),
      dataIndex: "description",
      key: "document_templates.description",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documentTemplates.table.locale"),
      dataIndex: "locale",
      key: "document_templates.locale",
      sorter: true,
      filterable: true,
      render: (text: string, record: any) => {
        const language = _.find(languageTypes, { value: text });
        return language.label;
      }
    },
    {
      title: t("pages:documentTemplates.table.Active_status"),
      dataIndex: "Active_status",
      key: "document_templates.Active_status",
      sorter: true,
      filterable: true,
      render: (text: string, record: any) => {
        if(record.Active_status == 1){
          return <Tag color="green">{t('buttons:active')}</Tag>
        }
        else{
          return <Tag color="red">{t('buttons:Deactive')}</Tag>
        }
      }
    },
    {
      title: t("pages:documentTemplates.table.createdAt"),
      dataIndex: "createdAt",
      key: "document_templates.createdAt",
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

            <a onClick={() => {
              redirect("frontend.admin.documentTemplates.copy", { id: record.code })
            }}>
              <CopyOutlined />
              { t("buttons:copy")}
            </a>
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    getCheckboxProps: (record) => ({
      id: record.id,
    }),
  };

  const onDelete = async () => {
    let [error, result]: any[] = await to(documentTemplateService().withAuth().delete({ ids: selectedIds }));
    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t("messages:message.recordDocumenTemplateDeleted"));

    if (tableRef.current !== null) {
      tableRef.current.reload()
    }

    setSelectedIds([])
    setHiddenDeleteBtn(true)
  }

  const onChangeSelection = (data: any) => {
    if (data.length > 0) setHiddenDeleteBtn(false)
    else setHiddenDeleteBtn(true)
    setSelectedIds(data)
  }

  const fetchData = async (values: any) => {
    if (!values.sorting.length) {
      values.sorting = [{ field: "document_templates.id", direction: "desc" }];
    }
    let [error, documentTemplates]: [any, any[]] = await to(
      documentTemplateService().withAuth().index(values)
    );
    if (error) {
      const { code, message } = error;
      notify(t(`errors:${code}`), t(message), "error");
      return {};
    }
    return documentTemplates;
  };


  return (
    <>
      <div className="content">
        <Button
          type="primary"
          className='btn-top'
          hidden={!createPer}
          onClick={() => redirect("frontend.admin.documentTemplates.create")}
        >
          <PlusCircleOutlined /> {t('buttons:Create_Document_Templates')}
        </Button>
        <Button
        type="primary" danger
        className='btn-top'
        hidden={hiddenDeleteBtn || !deletePer}
        onClick={() => {
          confirmDialog({
            title: t('buttons:deleteItem'),
            content: t('messages:message.deleteConfirm'),
            onOk: () => onDelete()
          })
        }}
      >
        <DeleteOutlined />
        {t('buttons:delete')}
      </Button>
        <GridTable
          ref={tableRef}
          columns={columns}
          fetchData={fetchData}
          addIndexCol={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {redirect("frontend.admin.documentTemplates.edit", { id: record.code })}, // click row
            };
          }}
          rowSelection={{ 
            selectedRowKeys: selectedIds, 
            onChange: (data: any[]) => onChangeSelection(data),
            checkStrictly: true, 
            ...rowSelection
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
      title={t("pages:documentTemplates.index.title")}
      description={t("pages:documentTemplates.index.description")}
      {...props}
    />
  );
};

Index.permissions = {
  document_templates: "R",
};

export default Index;
