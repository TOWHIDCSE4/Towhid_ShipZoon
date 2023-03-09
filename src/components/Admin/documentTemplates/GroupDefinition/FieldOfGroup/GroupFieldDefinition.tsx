import React from "react";
import {
  Form,
  Card,
  Button,
} from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import FieldDefinition from "@root/src/components/Admin/documentTemplates/GroupDefinition/FieldOfGroup/FieldDefinition/FieldDefinition";

const GroupFieldDefinition = ({ 
  formValue, 
  nameGroup ,
  documentTemplate,
  keyStep,
  keyGroup
}:{
  formValue:any, 
  nameGroup:any ,
  documentTemplate?:any,
  keyStep:any,
  keyGroup:any
}) => {
  const { t } = useBaseHook();

  return (
    <>
      <Form.List name={[nameGroup, "FieldDefinition"]}>
        {(fields, { add, remove }) => (
          <div onClick={(e) => e.stopPropagation()}>
            {fields.map((field, index, fullarr) => {
              let { key, name, ...restField } = field;
              return (
                <div key={String(key) + "FieldDefinition"}>
                  <Card
                    title={t(
                      "pages:documentTemplates.create.fieldInformation.title"
                    )}
                    style={{ width: "100%", marginBottom: "50px" }}
                    extra={
                      <MinusCircleOutlined
                        className="remove"
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <FieldDefinition 
                      nameField = {name} 
                      keyField = {key} 
                      formValue={formValue} 
                      documentTemplate={documentTemplate} 
                      keyStep = {keyStep}
                      keyGroup = {keyGroup}
                    />
                  </Card>
                </div>
              );
            })}
            <Form.Item className="text-center">
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
                icon={<PlusOutlined />}
                style={{ width: "100%" }}
              >
                {t("buttons:Add_field")}
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </>
  );
};

export default GroupFieldDefinition;
