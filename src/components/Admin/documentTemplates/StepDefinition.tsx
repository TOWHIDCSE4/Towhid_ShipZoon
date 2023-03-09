import React, { useState } from "react";
import { Form, Input, Card, Button } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import GroupStepDefinition from "@root/src/components/Admin/documentTemplates/GroupDefinition/GroupStepDefinition";

const StepDefinition = ({ formValue,documentTemplate }:{formValue:any,documentTemplate?:any }) => {
  const { t } = useBaseHook();
  return (
    <>
      <Form.List name="createDocumentTemplates">
        {(fields, { add, remove }) => (
          <div onClick={(e) => e.stopPropagation()}>
            {fields.map((field, index, fullarr) => {
              let { key, name, ...restField } = field;
              return (
                <Card
                  key={key + "createDocumentTemplates"}
                  title={
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      name={[name, "stepTitle"]}
                      label={t(
                        "pages:documentTemplates.create.fieldInformation.stepTitle"
                      )}
                      rules={[
                        {
                          required: true,
                          message: t("messages:form.required", {
                            name: t(
                              "pages:documentTemplates.create.fieldInformation.stepTitle"
                            ),
                          }),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t(
                          "pages:documentTemplates.create.fieldInformation.stepTitle"
                        )}
                        style={{ width: "95%" }}
                      />
                    </Form.Item>
                  }
                  style={{ width: "100%", marginBottom: "50px" }}
                  extra={
                    <MinusCircleOutlined
                      className="remove"
                      onClick={() => remove(name)}
                    />
                  }
                >
                  <GroupStepDefinition 
                  formValue={formValue} 
                  nameStep={name} 
                  keyStep={key}
                  documentTemplate={documentTemplate} />
                </Card>
              );
            })}
            <Form.Item className="text-center">
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
                icon={<PlusOutlined />}
                style={{ width: "70%" }}
              >
                {t("buttons:Add_Step")}
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </>
  );
};

export default StepDefinition;
