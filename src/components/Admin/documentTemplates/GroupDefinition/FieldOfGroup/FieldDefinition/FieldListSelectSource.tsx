import React, { useState, useEffect } from "react";
import { Form, Col, Row, Input, Select, Button } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import documentTemplateService from '@root/src/services/documentTemplateService'
import useSWR from 'swr';

const listSourceTypes = ["database", "manual"];
const tables = ["users", "roles", "companies"];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const FieldListSource = ({ 
  nameListSource,
  keyStep,
  keyGroup,
  keyField ,
  documentTemplate,
}:{nameListSource:any,keyStep:any,keyGroup:any,keyField:any,documentTemplate:any}) => {
  const { t,getData } = useBaseHook();
  const [sourceType, setSourceType] = useState(documentTemplate?.createDocumentTemplates[keyStep]?.GroupDefinition[keyGroup]?.FieldDefinition[keyField]?.listSelect?.sourceType || "manual");
  // const { data } = useSWR('selectParent', () => documentTemplateService().withAuth().select2())
  // const dataBase = getData(data, "data", [])

  const dataBase = []
  return (
    <>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          name={[nameListSource, "listSelect", "sourceType"]}
          label={t(
            "pages:documentTemplates.create.fieldInformation.sourceType"
          )}
          initialValue={documentTemplate?.createDocumentTemplates[keyStep]?.GroupDefinition[keyGroup]?.FieldDefinition[keyField]?.listSelect?.sourceType || "manual"}
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.sourceType"
                ),
              }),
            },
          ]}
        >
          <Select
            placeholder={t(
              "pages:documentTemplates.create.fieldInformation.sourceType"
            )}
            allowClear
            showSearch
            onChange={(value) => {
              setSourceType(value);
            }}
          >
            {listSourceTypes.map((listSourceType) => (
              <Select.Option key={listSourceType} value={listSourceType}>
                {listSourceType}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {sourceType == "database" ? (
        <Col span={12}>
          <Form.Item
            {...formItemLayout}
            name={[nameListSource, "listSelect", "source"]}
            label={t("pages:documentTemplates.create.fieldInformation.source")}
            rules={[
              {
                required: true,
                message: t("messages:form.required", {
                  name: t(
                    "pages:documentTemplates.create.fieldInformation.source"
                  ),
                }),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.source"
              )}
            >
              {dataBase.map((data) => (
                <Select.Option key={data.value} value={data.value}>
                  {data.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      ) : (
        <Col span={24}>
          <Form.List name={[nameListSource, "listSelect", "source"]}>
            {(fields, { add, remove }) => (
              <div onClick={(e) => e.stopPropagation()}>
                {fields.map((field, index, fullarr) => {
                  let { key, name, ...restField } = field;
                  return (
                    <Row key={key} style={{ textAlign: "center" }}>
                      <Col span={4}></Col>
                      <Col span={7}>
                        <Form.Item
                          name={[name, "label"]}
                          rules={[
                            { required: true, message:  t("messages:message.missing_lable") },
                          ]}
                        >
                          <Input placeholder="label Option" />
                        </Form.Item>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <Form.Item
                          name={[name, "value"]}
                          rules={[
                            { required: true, message: t("messages:message.missing_option") },
                          ]}
                        >
                          <Input placeholder="Value Option" />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <MinusCircleOutlined
                          style={{ marginTop: 10 }}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  );
                })}
                <Form.Item className="text-center">
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    icon={<PlusOutlined />}
                    style={{ width: "60%" }}
                  >
                    {t("buttons:Add_Option_Select")}
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Col>
      )}
    </>
  );
};

export default FieldListSource;
