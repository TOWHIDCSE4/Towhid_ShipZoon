import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Spin, Card, Row, Col } from "antd";
import documentService from "@src/services/documentService";
import to from "await-to-js";
import useBaseHook from "@src/hooks/BaseHook";
import {
  CheckCircleOutlined,
} from "@ant-design/icons";
import CreatedForm from "@root/src/components/Admin/Application/Created/CreatedForm";
import moment from "moment-timezone";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { confirmDialog } from "@src/helpers/dialogs";
import useTableFormHook from "@root/src/hooks/TableFormHook";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Detail = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [documentTemplate, setDocumentTemplate]: any[] = useState();
  const [document, setDocument]: any = useState();
  const [form] = Form.useForm();
  const { query } = router;
  const [loadingDraff, setLoadingDraff] = useState(false);
  const [value, setValues] = useState({});
  const { TableForm } = useTableFormHook();

  const fetchData = async () => {
    let idError: any = null;
    if (!query.id) {
      idError = {
        code: 9996,
        message: "missing ID",
      };
    }
    if (idError) return notify(t(`errors:${idError.code}`), "", "error");
    let [documentError, document]: [any, any] = await to(
      documentService().withAuth().detail({ id: query.id })
    );
    TableForm.clearAll();
    if (documentError)
      return notify(t(`errors:${documentError.code}`), "", "error");
    if (!document.template) return notify(t(`errors:9996`), "", "error");
    let FieldDateForm = [];
    let FieldFileForm = [];
    let tableField = []
    if (document?.template && document.content) {
      document?.template?.forEach((stepField: any) => {
        stepField.GroupDefinition.forEach((groupField: any) => {
          groupField.FieldDefinition.forEach((field: any) => {
            if (
              field.inputType == "dateTimeInput" ||
              field.inputType == "dateTimeShowTimeInput"
            ) {
              FieldDateForm.push(field.fieldName);
            }
            if (field.inputType == "fileInput") {
              FieldFileForm.push(field.fieldName);
            }
            if (field.inputType == "tableInput") {
              tableField.push(field.fieldName);
            }
          });
        });
      });

      FieldDateForm.forEach((item: any) => {
        if (document?.content[item]) {
          document.content[item] = moment(document?.content[item]);
        }
      });
      FieldFileForm.forEach((item: any) => {
        document.content[item] = document?.content[item]?.map(
          (file: any, index: number) => {
            let name = String(file)?.split("/") || [];
            return {
              uid: `${index}`,
              name: name[name.length - 1],
              status: "done",
              url: publicRuntimeConfig.DOMAIN + file,
            };
          }
        );
      });
      tableField.forEach((item: any) => {
        TableForm.setData({ nameTable: item, newData: document?.content[item] })
      })
    }
    setDocumentTemplate(document?.template || []);
    setDocument(document);
    setValues(document.content);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSaveAndSubmit = async (dataSubmit: any): Promise<any> => {
    let values = {
      ...value,
      ...dataSubmit,
    };
    let dataContent = documentTemplate || [];
    let FieldTableForm = [];
    let FieldDateForm = [];
    let FieldFileForm = [];
    dataContent?.forEach((stepField: any) => {
      stepField.GroupDefinition?.forEach((groupField: any) => {
        groupField.FieldDefinition?.forEach((field: any) => {
          if (
            field.inputType == "dateTimeInput" ||
            field.inputType == "dateTimeShowTimeInput"
          ) {
            FieldDateForm.push(field.fieldName);
          }
          if (field.inputType == "fileInput") {
            FieldFileForm.push(field.fieldName);
          }
          if (field.inputType == "tableInput") {
            FieldTableForm.push(field.fieldName);
          }
        });
      });
    });

    FieldDateForm.forEach((item: any) => {
      if (values[item]) {
        values[item] = moment(values[item]).format("YYYY-MM-DD");
      }
    });
    FieldFileForm.forEach((item: any) => {
      delete values[item]?.file;
    });

    for (let col of FieldTableForm) {
      const [e, vadidate] = await to(TableForm.validate({ nameTable: col }));
      if (e) {
        return
      }
      values[col] = TableForm.getData({ nameTable: col })
    }

    if (!document.id) return notify(t(`errors:9996`), "", "error");
    setLoading(true);
    let [error, result]: any[] = await to(
      documentService()
        .withAuth()
        .edit({
          id: document.id,
          statusDocumentTemplate: 2,
          ...values,
        })
    );

    setLoading(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentUpdated"));
    redirect("frontend.admin.documents.index");
    return result;
  };

  const onFinishDraff = async (): Promise<void> => {
    const [errorField, dataSubmit] = await to(form.validateFields());
    if (errorField) {
      return;
    }
    let values = {
      ...value,
      ...dataSubmit,
    };
    let dataContent = documentTemplate || [];
    let FieldDateForm = [];
    let FieldFileForm = [];
    let FieldTableForm = [];

    dataContent?.forEach((stepField: any) => {
      stepField.GroupDefinition?.forEach((groupField: any) => {
        groupField.FieldDefinition?.forEach((field: any) => {
          if (
            field.inputType == "dateTimeInput" ||
            field.inputType == "dateTimeShowTimeInput"
          ) {
            FieldDateForm.push(field.fieldName);
          }
          if (field.inputType == "fileInput") {
            FieldFileForm.push(field.fieldName);
          }
          if (field.inputType == "tableInput") {
            FieldTableForm.push(field.fieldName);
          }
        });
      });
    });

    FieldDateForm.forEach((item: any) => {
      if (values[item]) {
        values[item] = moment(values[item]).format("YYYY-MM-DD");
      }
    });
    FieldFileForm.forEach((item: any) => {
      delete values[item]?.file;
    });

    for (let col of FieldTableForm) {
      const [e, vadidate] = await to(TableForm.validate({ nameTable: col }));
      if (e) {
        return
      }
      values[col] = TableForm.getData({ nameTable: col })
    }

    if (!document.id) return notify(t(`errors:9996`), "", "error");
    setLoadingDraff(true);
    let [error, result]: any[] = await to(
      documentService()
        .withAuth()
        .edit({
          id: document.id,
          statusDocumentTemplate: 1,
          ...values,
        })
    );

    setLoadingDraff(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentDraftCreated"));
    redirect("frontend.admin.documents.index");
    return result;
  };

  if (!document || !documentTemplate)
    return (
      <div className="content">
        <Spin />
      </div>
    );
  return (
    <div className="content">
      <Form
        form={form}
        name="detailDraftApplication"
        layout="vertical"
        initialValues={document.content}
        scrollToFirstError
        onFinish={(value) => {
          confirmDialog({
            title:  t("pages:confirmDialog.documentDraft.submit.title"),
            icon: <CheckCircleOutlined style={{ color: "green" }} />,
            content: t("pages:confirmDialog.documentDraft.submit.description"),
            onOk: () => onSaveAndSubmit(value),
            okText: t("buttons:confirm"),
          });
        }}
      >
        <Card title={document?.name?.toUpperCase()}>
          <CreatedForm
            documentTempale={documentTemplate}
            form={form}
            loadingDraff={loadingDraff}
            onFinishDraff={onFinishDraff}
            loading={loading}
            setValues={setValues}
            value={value}
          />
        </Card>
      </Form>
      <br />
    </div>
  );
};

Detail.Layout = (props) => {
  const { t } = useBaseHook();
  return <Layout title={" "} description={" "} {...props} />;
};

Detail.permissions = {
  documents: "R",
};

export default Detail;
