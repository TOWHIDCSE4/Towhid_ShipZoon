import React, { useRef, useState } from "react";
import {
  Form,
  Col,
  Row,
  Input,
  Card,
  Select,
  InputNumber,
  Tag,
  Button,
} from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import FieldListSelectSource from "@root/src/components/Admin/documentTemplates/GroupDefinition/FieldOfGroup/FieldDefinition/FieldListSelectSource";
import FieldListRadioSource from "@root/src/components/Admin/documentTemplates/GroupDefinition/FieldOfGroup/FieldDefinition/FieldListRadioSource";
import FieldListTableSource from "@root/src/components/Admin/documentTemplates/GroupDefinition/FieldOfGroup/FieldDefinition/FieldListTableSource";
import FieldValidations from "@root/src/components/Admin/documentTemplates/GroupDefinition/FieldOfGroup/FieldDefinition/FieldValidations";

import configDocument from "@src/config/DocumentTemplate";
let { dataTypes, inputTypes, validations } = configDocument;
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

const tagRender = (props: CustomTagProps) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const FieldDefinition = ({ 
  nameField, 
  keyField,
  formValue,
  documentTemplate ,
  keyStep,
  keyGroup
}:{
  nameField:any, 
  keyField:any,
  formValue:any,
  documentTemplate:any,
  keyStep:any,
  keyGroup:any
}) => {
  const { t } = useBaseHook();
  const [needList, setNeedList] = useState(documentTemplate?.createDocumentTemplates[keyStep]?.GroupDefinition[keyGroup]?.FieldDefinition[keyField]?.inputType || '');

  return (
    <Row>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          name={[nameField, "fieldName"]}
          label={t("pages:documentTemplates.create.fieldInformation.fieldName")}
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.fieldName"
                ),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.fieldName"
                ),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.fieldName"
                ),
                length: 255,
              }),
            },
          ]}
        >
          <Input
            placeholder={t(
              "pages:documentTemplates.create.fieldInformation.fieldName"
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={[nameField, "label"]}
          {...formItemLayout}
          label={t("pages:documentTemplates.create.fieldInformation.label")}
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.label"
                ),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.label"
                ),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.label"
                ),
                length: 255,
              }),
            },
          ]}
        >
          <Input
            placeholder={t(
              "pages:documentTemplates.create.fieldInformation.label"
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          name={[nameField, "position"]}
          label={t("pages:documentTemplates.create.fieldInformation.position")}
          rules={[]}
        >
          <InputNumber
            placeholder={t(
              "pages:documentTemplates.create.fieldInformation.position"
            )}
            min={1}
            max={1000}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          labelCol={{
            xs: { span: 24 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 18 },
          }}
          label={t("pages:documentTemplates.create.fieldInformation.col")}
        >
          <Form.Item
            key={String(keyField) + "xs"}
            name={[nameField, "col", "xs"]}
            style={{ display: "inline-block" }}
          >
            <InputNumber
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.xs"
              )}
              min={0}
              max={24}
            />
          </Form.Item>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              textAlign: "center",
            }}
          ></span>
          <Form.Item
            key={String(keyField) + "sm"}
            name={[nameField, "col", "sm"]}
            style={{ display: "inline-block" }}
          >
            <InputNumber
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.sm"
              )}
              min={0}
              max={24}
            />
          </Form.Item>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              textAlign: "center",
            }}
          ></span>
          <Form.Item
            key={String(keyField) + "lg"}
            name={[nameField, "col", "lg"]}
            style={{ display: "inline-block" }}
          >
            <InputNumber
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.lg"
              )}
              min={0}
              max={24}
            />
          </Form.Item>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              textAlign: "center",
            }}
          ></span>
          <Form.Item
            key={String(keyField) + "md"}
            name={[nameField, "col", "md"]}
            style={{ display: "inline-block" }}
          >
            <InputNumber
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.md"
              )}
              min={0}
              max={24}
            />
          </Form.Item>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          name={[nameField, "inputType"]}
          label={t("pages:documentTemplates.create.fieldInformation.inputType")}
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.inputType"
                ),
              }),
            },
          ]}
        >
          <Select
            placeholder={t(
              "pages:documentTemplates.create.fieldInformation.inputType"
            )}
            allowClear
            showSearch
            style={{ width: "100%" }}
            onChange={(value, options) => {
              if(formValue){
                let dataTemplate = formValue.getFieldsValue();
                if(dataTemplate 
                  && dataTemplate.createDocumentTemplates 
                  && dataTemplate.createDocumentTemplates[keyStep].GroupDefinition 
                  && dataTemplate.createDocumentTemplates[keyStep].GroupDefinition[keyGroup].FieldDefinition
                  && dataTemplate.createDocumentTemplates[keyStep].GroupDefinition[keyGroup].FieldDefinition[keyField].validations
                  ){
                    dataTemplate.createDocumentTemplates[keyStep].GroupDefinition[keyGroup].FieldDefinition[keyField].validations =  []
                  }
                formValue.setFieldsValue(dataTemplate)
              }
              setNeedList(value);
            }}
          >
            {inputTypes.map((inputType) => (
              <Select.Option key={inputType.value} value={inputType.value}>
                {inputType.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {needList && needList != 'tableInput' ? (
        <FieldValidations 
        nameListSource={nameField} 
        keyField={keyField}
        keyStep={keyStep}
        formValue={formValue}
        keyGroup={keyGroup}
        documentTemplate={documentTemplate}
        needList={needList} />
      ) : (
        <></>
      )}
      {needList == "selectInput" ? (
        <FieldListSelectSource 
        keyStep={keyStep}
        keyGroup={keyGroup}
        nameListSource={nameField} 
        keyField={keyField}
        documentTemplate={documentTemplate}
        />
      ) : needList == "radioInput" ? (
        <FieldListRadioSource 
        nameListSource={nameField} 
        />
      ) : needList == "tableInput" ? (
        <FieldListTableSource nameListSource={nameField} />
      ):(
        <></>
      )}
    </Row>
  );
};

export default FieldDefinition;
