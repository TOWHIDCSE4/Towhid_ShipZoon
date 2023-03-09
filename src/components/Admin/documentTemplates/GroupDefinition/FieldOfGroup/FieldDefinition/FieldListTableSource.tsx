import React, { useState } from "react";
import { Form, Col, Row, Input, Select, Button,Tag } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import configDocument from "@src/config/DocumentTemplate";
let { validations } = configDocument;

const FieldListRadioSource = ({ nameListSource }) => {
  const { t } = useBaseHook();
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

  return (
    <>
      {
        <Col span={24}>
          <Form.List name={[nameListSource, "tableSelect"]}>
            {(fields, { add, remove }) => (
              <div onClick={(e) => e.stopPropagation()}>
                {fields.map((field, index, fullarr) => {
                  let { key, name, ...restField } = field;
                  return (
                    <Row key={key} style={{ textAlign: "center" }}>
                      <Col span={3}></Col>
                      <Col span={6}>
                        <Form.Item
                          name={[name, "title"]}
                          rules={[
                            { required: true, message: t("messages:message.missing_title") },
                          ]}
                        >
                          <Input placeholder="Title Col" />
                        </Form.Item>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={6}>
                        <Form.Item
                          name={[name, "dataIndex"]}
                          rules={[
                            { required: true, message: t("messages:message.missing_dataIndex") },
                          ]}
                        >
                          <Input placeholder="DataIndex" />
                        </Form.Item>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={6}>
                        <Form.Item
                          name={[name, "validations"]}
                        >
                          <Select
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.validations"
                            )}
                            mode="multiple"
                            showArrow
                            allowClear
                            showSearch
                            tagRender={tagRender}
                            style={{ width: "100%" }}
                            options={validations.tableInput}
                          />
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
                    {t("buttons:Add_Col_Table")}
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Col>
      }
    </>
  );
};

export default FieldListRadioSource;
