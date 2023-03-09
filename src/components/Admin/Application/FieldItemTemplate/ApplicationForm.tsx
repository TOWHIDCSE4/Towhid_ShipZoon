import useBaseHooks from "@root/src/hooks/BaseHook";
import { Card, Col, Row } from "antd";

import TextInputField from "@root/src/components/Admin/Application/FieldItemTemplate/TextInputField";
import NumberInputField from "@root/src/components/Admin/Application/FieldItemTemplate/NumberInputField";
import DateTimeInputField from "@root/src/components/Admin/Application/FieldItemTemplate/DateTimeInputField";
import SelectInputField from "@root/src/components/Admin/Application/FieldItemTemplate/SelectField";
import FileInputField from "@root/src/components/Admin/Application/FieldItemTemplate/FileInputField";
import TextAreaInputField from "@root/src/components/Admin/Application/FieldItemTemplate/TextAreaInputField";
import CheckboxField from "@root/src/components/Admin/Application/FieldItemTemplate/CheckboxField";
import RadioField from "@root/src/components/Admin/Application/FieldItemTemplate/RadioField";
import DateTimeshowTimeField from "@root/src/components/Admin/Application/FieldItemTemplate/DateTimeshowTimeField";
import TableField from "@root/src/components/Admin/Application/FieldItemTemplate/TableField";

const ApplicationForm = ({
  documentTempale = [],
  form,
  disabled = [],
}: {
  documentTempale: any[];
  form: any;
  disabled?: string[];
}) => {
  return (
    <>
      {documentTempale?.map((item, index) => {
        item.FieldDefinition = item.FieldDefinition?.sort(
          (a: any, b: any) => a.position - b.position
        );
        return (
          <div key={String(index) + String("Application")}>
            <Card key={index} title={item?.groupTitle}>
              <Row gutter={24}>
                {item?.FieldDefinition?.map((FieldDefi, index) => {
                  if (FieldDefi.fieldName && FieldDefi.inputType && FieldDefi.label) {
                    return (
                      <Col
                        key={String(index) + FieldDefi?.fieldName}
                        lg={FieldDefi?.col?.lg || 24}
                        md={FieldDefi?.col?.md || 24}
                        sm={FieldDefi?.col?.sm || 24}
                        xs={FieldDefi?.col?.xs || 24}
                      >
                        {FieldDefi.inputType === "textInput" ? (
                          <TextInputField fieldGroup={FieldDefi} />
                        ) : FieldDefi.inputType === "textAreaInput" ? (
                          <TextAreaInputField fieldGroup={FieldDefi} />
                        ) : FieldDefi.inputType === "numberInput" ? (
                          <NumberInputField fieldGroup={FieldDefi} />
                        ) : FieldDefi.inputType === "dateTimeInput" ? (
                          <DateTimeInputField
                            fieldGroup={FieldDefi}
                            form={form}
                          />
                        ) : FieldDefi.inputType === "dateTimeShowTimeInput" ? (
                          <DateTimeshowTimeField
                            fieldGroup={FieldDefi}
                            form={form}
                          />
                        ) : FieldDefi.inputType === "selectInput" ? (
                          <SelectInputField fieldGroup={FieldDefi} />
                        ) : FieldDefi.inputType === "fileInput" ? (
                          <FileInputField fieldGroup={FieldDefi} form={form} />
                        ) : FieldDefi.inputType === "checkboxInput" ? (
                          <CheckboxField fieldGroup={FieldDefi} />
                        ) : FieldDefi.inputType === "radioInput" ? (
                          <RadioField fieldGroup={FieldDefi} />
                        ) : FieldDefi.inputType === "tableInput" ? (
                          <TableField disabled={disabled} fieldGroup={FieldDefi} />
                        ) : (
                          <></>
                        )}
                      </Col>
                    );
                  } else {
                    return <Col
                      key={String(index) + FieldDefi?.fieldName}
                      lg={FieldDefi?.col?.lg || 24}
                      md={FieldDefi?.col?.md || 24}
                      sm={FieldDefi?.col?.sm || 24}
                      xs={FieldDefi?.col?.xs || 24}
                    >
                    </Col>
                  }
                })}
              </Row>
            </Card>
            <br />
          </div>
        );
      })}
    </>
  );
};

export default ApplicationForm;
