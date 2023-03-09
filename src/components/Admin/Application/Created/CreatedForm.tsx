import useBaseHooks from "@root/src/hooks/BaseHook";
import { useEffect, useState } from "react";
import { Tabs, Form, Button, Steps, Popover } from "antd";
import ApplicationForm from "@root/src/components/Admin/Application/FieldItemTemplate/ApplicationForm";
import _ from "lodash";
import type { StepsProps } from "antd";
import {
  LeftCircleFilled,
  SaveFilled,
  SnippetsOutlined,
  ExclamationCircleOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { confirmDialog } from "@src/helpers/dialogs";
import usePermissionHook from "@src/hooks/PermissionHook";
import to from "await-to-js";
import useTableFormHook from "@root/src/hooks/TableFormHook";


const CreatedForm = ({
  documentTempale,
  form,
  loadingDraff = false,
  onFinishDraff,
  loading = false,
  setValues,
  value,
}) => {
  const { t, getData, router } = useBaseHooks();
  const { checkPermission } = usePermissionHook();
  const { TableForm } = useTableFormHook();
  const CreatedPer = checkPermission({
    documents: "C",
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  let items = [];
  let documentGroup = documentTempale.map((item, index) => {
    items.push({
      title: item.stepTitle,
    });
    return item.GroupDefinition;
  });
  const customDot: StepsProps["progressDot"] = (dot, { status, index }) => (
    <Popover
      content={
        <span>
          step {index} status: {status}
        </span>
      }
    >
      {dot}
    </Popover>
  );

  return (
    <div>
      <Steps progressDot={customDot} current={currentIndex} items={items} />
      <br />
      <br />
      <br />
      <ApplicationForm
        documentTempale={documentGroup[currentIndex]}
        form={form}
      />
      <Form.Item wrapperCol={{ span: 24 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => router.back()} className="btn-margin-right">
            <LeftCircleFilled /> {t("buttons:back")}
          </Button>
          {currentIndex > 0 && (
            <Button
              className="btn-margin-right"
              type="primary"
              style={{
                backgroundColor: "#dfc64c",
                borderColor: "#dfc64c",
                color: "#2e2d2d",
              }}
              onClick={() => {
                form.resetFields();
                form.setFieldsValue(value);
                setCurrentIndex(currentIndex - 1);
              }}
            >
              <LeftCircleOutlined /> {t("buttons:previous")}
            </Button>
          )}
          {currentIndex == documentGroup.length - 1 && (
            <div>
              <Button
                className="btn-margin-right"
                loading={loadingDraff}
                onClick={() => {
                  confirmDialog({
                    title: "Exit Form",
                    icon: (
                      <ExclamationCircleOutlined style={{ color: "red" }} />
                    ),
                    content:
                      "Do you want to exit without saving? Then, all your input wont be saved in draft",
                    onOk: () => onFinishDraff(),
                    okText: t("buttons:SaveAndExit"),
                    okButtonProps: { danger: true },
                  });
                }}
              >
                <SnippetsOutlined /> {t("buttons:SaveAndExit")}
              </Button>
              <Button
                hidden={!CreatedPer}
                type="primary"
                htmlType="submit"
                className="btn-margin-right"
                loading={loading}
              >
                <SaveFilled /> {t("buttons:submit")}
              </Button>
            </div>
          )}
          {documentGroup.length > 1 &&
            currentIndex < documentGroup.length - 1 && (
              <Button
                className="btn-margin-right"
                type="primary"
                onClick={async () => {
                  const [errorField, values]: any = await to(
                    form.validateFields()
                  );
                  let FieldDefinition = []
                  documentGroup[currentIndex].forEach(element => {
                    element.FieldDefinition.forEach(field => {
                      if (field.inputType == 'tableInput') {
                        FieldDefinition.push(field.fieldName)
                      }
                    })
                  })

                  let err = null
                  for (let element of FieldDefinition) {
                    const [e, vadidate] = await to(TableForm.validate({ nameTable: element }));
                    if (e) {
                      return
                    }
                  }
                  if (!errorField && !err) {
                    let valuesData = {
                      ...value,
                      ...values,
                    };
                    setValues(valuesData);
                    setCurrentIndex(currentIndex + 1);
                  }
                }}
              >
                <RightCircleOutlined /> {t("buttons:next")}
              </Button>
            )}
        </div>
      </Form.Item>
    </div>
  );
};

export default CreatedForm;
