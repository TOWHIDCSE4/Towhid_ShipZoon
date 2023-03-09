import React, { useEffect, useState } from "react";
import to from "await-to-js";
import dynamic from "next/dynamic";
import { Button, Form, Col, Row, Input, Space, Select, Spin } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import StepDefinition from "@root/src/components/Admin/documentTemplates/StepDefinition";
import documentTemplateService from "@src/services/documentTemplateService";
import { SendOutlined, DeleteFilled } from "@ant-design/icons";
const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });
import { removeVietnameseTones } from "@src/helpers/utils";
import { confirmDialog } from '@src/helpers/dialogs'

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

const Copy = () => {
  const [loading, setLoading] = useState(false);
  const { t, notify, redirect, router } = useBaseHook();
  const [form] = Form.useForm();
  const [documentTemplate, setDocumentTemplate]: any = useState();
  const { query } = router;
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
      documentTemplateService().withAuth().detail({ id: query.id })
    );
    if (documentError)
      return notify(t(`errors:${documentError.code}`), "", "error");


    document.content = document.content.map((element: any) => {
      let stepTiTle = element.stepTitle;
      element.GroupDefinition = element.GroupDefinition.map((elementGroup: any) => {
        let groupTitle = elementGroup.groupTitle;
        elementGroup.FieldDefinition = elementGroup.FieldDefinition.map((elementField: any) => {
          let removeFieldName = removeVietnameseTones(stepTiTle) +'_'+ removeVietnameseTones(groupTitle) +'_'
          let fieldName = elementField.fieldName || '';
          fieldName = fieldName.slice(removeVietnameseTones(removeFieldName).length)
          
          elementField.tableSelect =  elementField.tableSelect?.map((elementTable: any) => {
            let dataIndex = elementTable.dataIndex || '';
            let removeTableName = removeVietnameseTones(stepTiTle) +'_'+ removeVietnameseTones(groupTitle) +'_' +removeVietnameseTones(fieldName) + '_'
            return {
              ...elementTable,
              dataIndex : dataIndex.slice(removeVietnameseTones(removeTableName).length)
            }
          })
          return {
            ...elementField,
            fieldName: fieldName,
          }
        })
        return {
          ...elementGroup,
        }
      })
      return {
        ...element
      }
    })
    let dataRevect = {
      code: document.code,
      name: document.name,
      locale: document.locale,
      createDocumentTemplates: document.content,
    };
    setDocumentTemplate(dataRevect);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitForm = async (values: any) => {
    let check = false;
    check =
      !values ||
      !values.createDocumentTemplates ||
      (Array.isArray(values.createDocumentTemplates) &&
        !values.createDocumentTemplates.length);
    if (
      values &&
      values.createDocumentTemplates &&
      Array.isArray(values.createDocumentTemplates) &&
      values.createDocumentTemplates.length
    ) {
      values.createDocumentTemplates.map((element: any) => {
        check = !element.GroupDefinition || !element.GroupDefinition.length;
        if (element.GroupDefinition && element.GroupDefinition.length) {
          element.GroupDefinition.map((elementGroup: any) => {
            check =
              !elementGroup.FieldDefinition ||
              !elementGroup.FieldDefinition.length;
          });
        }
      });
    }

    if (check) {
      return notify(t("messages:message.Missing_form_creation_information"), "", "error");
    }

    setLoading(true);
    let [error, result]: any[] = await to(
      documentTemplateService().withAuth().create(values)
    );
    setLoading(false);

    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentTemplateCreated"));
    redirect("frontend.admin.documentTemplates.index");
  };

  if (!documentTemplate)
    return (
      <div className="content">
        <Spin />
      </div>
    );
  return (
    <div className="content">
      <Form
        form={form}
        onFinish={submitForm}
        name="CopyTemplates"
        initialValues={{
          ...documentTemplate
        }}
        scrollToFirstError
      >
        <Row gutter={[32, 0]}>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["name"]}
              label={t(
                "pages:documentTemplates.create.fieldInformation.templatesName"
              )}
              rules={[
                {
                  required: true,
                  message: t("messages:form.required", {
                    name: t(
                      "pages:documentTemplates.create.fieldInformation.templatesName"
                    ),
                  }),
                },
              ]}
            >
              <Input
                placeholder={t(
                  "pages:documentTemplates.create.fieldInformation.templatesName"
                )}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["locale"]}
              label={t(
                "pages:documentTemplates.create.fieldInformation.language"
              )}
              rules={[
                {
                  required: true,
                  message: t("messages:form.required", {
                    name: t(
                      "pages:documentTemplates.create.fieldInformation.language"
                    ),
                  }),
                },
              ]}
            >
              <Select
                placeholder={t(
                  "pages:documentTemplates.create.fieldInformation.language"
                )}
                style={{ width: "100%" }}
              >
                {languageTypes.map((dataLang, index) => (
                  <Select.Option key={index} value={dataLang.value}>
                    {dataLang.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <StepDefinition formValue={form} documentTemplate={documentTemplate}  />
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
            >
              {t("buttons:submit")}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

Copy.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:documentTemplates.copy.title")}
      description={t("pages:documentTemplates.copy.description")}
      {...props}
    />
  );
};

Copy.permissions = {
  document_templates: "C",
};

export default Copy;
