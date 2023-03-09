import React, { useEffect, useState } from "react";
import { Form, Col, Row, InputNumber, Select, Tag } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import configDocument from "@src/config/DocumentTemplate";
let { dataTypes, inputTypes, validations } = configDocument;
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
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


const FieldValidations = ({
  nameListSource,
  needList,
  keyStep,
  keyGroup,
  keyField,
  documentTemplate,
  formValue
}) => {
  const { t } = useBaseHook();
  const [validationType, setValidationType]: any[] = useState(documentTemplate?.createDocumentTemplates[keyStep]?.GroupDefinition[keyGroup]?.FieldDefinition[keyField]?.validations || []);
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

  useEffect(() => {
    let dataTemplate = formValue.getFieldsValue();
    if(dataTemplate 
      && dataTemplate.createDocumentTemplates 
      && dataTemplate.createDocumentTemplates[keyStep].GroupDefinition 
      && dataTemplate.createDocumentTemplates[keyStep].GroupDefinition[keyGroup].FieldDefinition
      && dataTemplate.createDocumentTemplates[keyStep].GroupDefinition[keyGroup].FieldDefinition[keyField].validations
      ){
        setValidationType(dataTemplate.createDocumentTemplates[keyStep].GroupDefinition[keyGroup].FieldDefinition[keyField].validations)
      }
  },[needList])


  const listFileUpload = [{
    label: "image/jpeg",
    value: "image/jpeg"
  },{
    label: 'image/png',
    value: 'image/png'
  },{
    label: "image/jpg",
    value: "image/jpg"
  },{
    label: "excel/xlsx",
    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  },{
    label: "excel/xls",
    value: "application/vnd.ms-excel"
  },{
    label: "word/doc",
    value: "application/msword"
  },{
    label: "excel/docx",
    value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },{
    label: "powerpoint/ppt",
    value: "application/vnd.ms-powerpoint"
  },{
    label: "powerpoint/pptx",
    value: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  },]
  
  return (
    <>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          name={[nameListSource, "validations"]}
          label={t(
            "pages:documentTemplates.create.fieldInformation.validations"
          )}
        >
          <Select
            placeholder={t(
              "pages:documentTemplates.create.fieldInformation.validations"
            )}
            mode="multiple"
            showArrow
            allowClear
            showSearch
            onChange={(value) => {
              setValidationType(value || []);
            }}
            tagRender={tagRender}
            style={{ width: "100%" }}
            options={validations[needList]}
          />
        </Form.Item>
      </Col>
      {
        validationType.includes("max") &&
        (<Col span={12}>
          <Form.Item
            {...formItemLayout}
            name={[nameListSource, "validationMax"]}
            label={t(
              "pages:documentTemplates.create.fieldInformation.validationMax"
            )}
            rules={[
              { required: true, message: t("pages:documentTemplates.create.fieldInformation.validationMax") },
            ]}
          >
            <InputNumber
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.validationMax"
              )}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>)
      }
      {
        validationType.includes("type_file_upload") &&
        (<Col span={12}>
          <Form.Item
            {...formItemLayout}
            name={[nameListSource, "validationTypeFileUpload"]}
            label={t(
              "pages:documentTemplates.create.fieldInformation.validationTypeFileUpload"
            )}
            rules={[
              { required: true, message: t("pages:documentTemplates.create.fieldInformation.validationTypeFileUpload") },
            ]}

          >
            <Select
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.validationTypeFileUpload"
              )}
              mode="multiple"
              showArrow
              allowClear
              showSearch
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={listFileUpload}
            />
          </Form.Item>
        </Col>)
      }
      {
        validationType.includes("size_file_upload") &&
        (<Col span={12}>
          <Form.Item
            {...formItemLayout}
            name={[nameListSource, "validationSizeFileUpload"]}
            label={t(
              "pages:documentTemplates.create.fieldInformation.validationSizeFileUpload"
            )}
            rules={[
              { required: true, message: t("pages:documentTemplates.create.fieldInformation.validationSizeFileUpload") },
            ]}
          >
            <InputNumber
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.validationSizeFileUpload"
              ) + " (MB)"}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>)
      }
      {
        validationType.includes("number_file_upload") &&
        (<Col span={12}>
          <Form.Item
            {...formItemLayout}
            name={[nameListSource, "validationNumberFileUpload"]}
            label={t(
              "pages:documentTemplates.create.fieldInformation.validationNumberFileUpload"
            )}
            rules={[
              { required: true, message: t("pages:documentTemplates.create.fieldInformation.validationNumberFileUpload") },
            ]}
          >
            <InputNumber
              placeholder={t(
                "pages:documentTemplates.create.fieldInformation.validationNumberFileUpload"
              )}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>)
      }
    </>
  );
};

export default FieldValidations;
