import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Form, Spin, Card } from "antd";
import documentTemplateService from "@src/services/documentTemplateService";
import documentService from "@src/services/documentService";
import to from "await-to-js";
import useBaseHook from "@src/hooks/BaseHook";
import {
  CheckCircleOutlined,
} from "@ant-design/icons";
import CreatedForm from "@root/src/components/Admin/Application/Created/CreatedForm";
import moment from "moment-timezone";
import { confirmDialog } from "@src/helpers/dialogs";
import useTableFormHook from "@root/src/hooks/TableFormHook";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Create = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [loadingDraff, setLoadingDraff] = useState(false);
  const [value, setValues] = useState({});
  const [documentTemplate, setDocumentTemplate]: any[] = useState();
  const [template, setTemplate]: any = useState();
  const [form] = Form.useForm();
  const { query } = router;
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
    let [documentTemplateError, documentTemplate]: [any, any] = await to(
      documentTemplateService().withAuth().getTemplateDetail({ id: query.id })
    );
    if (documentTemplateError) {
      if (documentTemplateError.data && documentTemplateError.data.length) {
        documentTemplateError.data.forEach((item: any) => {
          notify(t(`errors:${item.code}`), "", "error");
        });
      }
      return notify(t(`errors:${documentTemplateError.code}`), "", "error");
    }
    if (!documentTemplate.content) return notify(t(`errors:9996`), "", "error");
    TableForm.clearAll()
    setDocumentTemplate(documentTemplate?.content);
    setTemplate(documentTemplate);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //submit form
  const onFinish = async (dataSubmit: any): Promise<void> => {
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

    if (!template.id) return notify(t(`errors:9996`), "", "error");
    setLoading(true);
    let [error, result]: any[] = await to(
      documentService()
        .withAuth()
        .create({
          documentTemplateId: template.id,
          statusDocumentTemplate: 2,
          ...values,
        })
    );

    setLoading(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentCreated"));
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

    if (!template.id) return notify(t(`errors:9996`), "", "error");
    setLoadingDraff(true);
    let [error, result]: any[] = await to(
      documentService()
        .withAuth()
        .create({
          documentTemplateId: template.id,
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

  if (!template)
    return (
      <div className="content">
        <Spin />
      </div>
    );
  return (
    <div className="content">
      <Card title={String(template.name).toLocaleUpperCase()}>
        <Form
          form={form}
          name="CreaterApplication"
          layout="vertical"
          initialValues={{}}
          onFinish={(value) => {
            confirmDialog({
              title: t("pages:confirmDialog.documents.confirm.title"),
              icon: <CheckCircleOutlined style={{ color: "green" }} />,
              content: t("pages:confirmDialog.documents.confirm.description"),
              onOk: () => onFinish(value),
              okText: t("buttons:confirm"),
            });
          }}
          scrollToFirstError
        >
          <CreatedForm
            documentTempale={documentTemplate}
            form={form}
            loadingDraff={loadingDraff}
            onFinishDraff={onFinishDraff}
            loading={loading}
            setValues={setValues}
            value={value}
          />
        </Form>
      </Card>
    </div>
  );
};

Create.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout title={t(" ")} description={t(" ")} {...props} />;
};

Create.permissions = {
  documents: "C",
};

export default Create;
