import dynamic from "next/dynamic";
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import { Button } from "antd";
import documentService from "@root/src/services/documentService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import React, { useState, useRef } from "react";
import { confirmDialog } from "@src/helpers/dialogs";
import useBaseHook from "@src/hooks/BaseHook";
import usePermissionHook from "@src/hooks/PermissionHook";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";


const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Draft = () => {
  const { t, notify, redirect } = useBaseHook();
  const tableRef = useRef(null);
  const { checkPermission } = usePermissionHook();
  const [selectedIds, setSelectedIds] = useState([]);
  const [hiddenDeleteBtn, setHiddenDeleteBtn] = useState(true);

  const deletePer = checkPermission({
    documents: "D",
  });

  const columns = [
    {
      title: t("pages:documents.table.name"),
      dataIndex: "name",
      key: "documents.name",
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
      title: t("pages:action"),
      key: "action",
      width: 130,
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {
              deletePer && (
                <a style={{ paddingRight: 10 }} onClick={() => {
                  confirmDialog({
                    title: t("pages:confirmDialog.draft.title"),
                    icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
                    content: t("pages:confirmDialog.draft.description"),
                    onOk: () => { onDeleteOne({ id: record.id }) },
                    okText: t("buttons:delete"),
                    okButtonProps: { danger: true },
                  });
                }}>
                  Delete
                </a>
              )
            }
            <a style={{ color: '#000' }} onClick={event => { redirect("frontend.admin.documents.detailDraft", { id: record.code }) }} >
              Continue
            </a>
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    getCheckboxProps: (record) => ({
      disabled: record.id == 1,
      id: record.id,
    }),
  };

  const onChangeSelection = (data: any) => {
    if (data.length > 0) setHiddenDeleteBtn(false)
    else setHiddenDeleteBtn(true)
    setSelectedIds(data)
  }

  const fetchData = async (values: any) => {
    if (!values.sorting.length) {
      values.sorting = [{ field: "documents.id", direction: "desc" }];
    }
    let [error, documents]: [any, User[]] = await to(
      documentService().withAuth().getDocumentDraff(values)
    );
    if (error) {
      const { code, message } = error;
      notify(t(`errors:${code}`), t(message), "error");
      return {};
    }
    return documents;
  };

  const onDelete = async () => {
    let [error, result]: any[] = await to(
      documentService().withAuth().delete({ ids: selectedIds })
    );
    if (error) return notify(t(`errors:${error.code}`), "", "error");
    notify(t("messages:message.recordDocumentsDraftDeleted"));
    if (tableRef.current !== null) {
      tableRef.current.reload();
    }
    setSelectedIds([]);
    setHiddenDeleteBtn(true);
    return result;
  };

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
        <Button
          danger
          className="btn-top"
          hidden={hiddenDeleteBtn || !deletePer}
          onClick={() => {
            confirmDialog({
              title: t("buttons:deleteItem"),
              content: t("messages:message.deleteConfirm"),
              onOk: () => onDelete(),
            });
          }}
        >
          <DeleteOutlined />
          {t("buttons:delete")}
        </Button>
        <GridTable
          ref={tableRef}
          columns={columns}
          fetchData={fetchData}
          addIndexCol={false}
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

Draft.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:documents.draft.title")}
      description={t("pages:documents.draft.description")}
      {...props}
    />
  );
};

Draft.permissions = {
  documents: 'C',
};

export default Draft;
