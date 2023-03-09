import React from 'react';
import { Form,Input } from 'antd';
import EditableTable from '@root/src/components/Admin/Application/FieldItemTemplate/Table/EditableTable';
import _ from "lodash";
import useBaseHooks from "@root/src/hooks/BaseHook";
import { validations } from "@src/config/ListVadidations";

interface EditableProductTable {
    fieldGroup: any;
    disabled?: string[];
}

const EditableProductTable: React.FC<EditableProductTable> = ({fieldGroup,disabled = []}) => {
  const [form] = Form.useForm();
  const { notify, t } = useBaseHooks();

  const columns = fieldGroup.tableSelect.map((item: any) => {
    let listValidations =
    item?.validations?.map((item) => {
      return validations({ name: item.title, validation: item, t: t });
    }) || [];
    
    return ({
      title: item.title,
      key: item.dataIndex,
      dataIndex: item.dataIndex,
      editable: true,
      rules: listValidations,
      customComponent: ({ editing, value, record }) => {
        if (editing) return <Input />;
        return value;
      },
    })
  })


  return (
    <Form form={form} component={false} name={fieldGroup.fieldName}>
      <h3>{fieldGroup.label}</h3>
      <EditableTable
        disabled={disabled}
        columns={columns}
        form={form}
        nameTable={fieldGroup.fieldName}
      />
    </Form>
  );
};

export default EditableProductTable
