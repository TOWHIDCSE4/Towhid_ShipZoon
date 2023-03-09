import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Typography,
  Button,
  Tooltip
} from "antd";
import _ from "lodash";
import { PlusCircleOutlined, DeleteOutlined, SaveOutlined, CloseSquareOutlined, EditOutlined, DeleteTwoTone } from "@ant-design/icons";
import useTableFormHook from "@root/src/hooks/TableFormHook";
import useBaseHooks from "@root/src/hooks/BaseHook";
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: any;
  index: number;
  children: React.ReactNode;
  customerComponent?: React.FC;
}

interface EditableProductTableProps {
  defaultValue?: any;
  columns: any[];
  form: any;
  nameTable: string;
  disabled?: string[];
}

const EditableTable: React.FC<EditableProductTableProps> = ({
  columns = [],
  form,
  nameTable,
  disabled = [],
}) => {
  const { t } = useBaseHooks();  
  const getColumnByKey = (key) => {
    return columns.find((item) => item.dataIndex === key);
  };

  const customInput: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let column = getColumnByKey(dataIndex);
    let customComponent = _.get(column, "customComponent");
    let editable = _.get(column, "editable");
    let rules = _.get(column, "rules", []);
    let fieldValue = _.get(record, dataIndex);
    if (!editable) {
      return <td {...restProps}>
        {children}
      </td>
    }

    let custom = customComponent ? customComponent({ editing, value: fieldValue, record }) : <Input />

    if (editing) {
      custom = (
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules}>
          {custom}
        </Form.Item>
      )
    }

    return (
      <td {...restProps}>
        {editing
          ? custom
          :
          customComponent ? custom : fieldValue}
      </td>
    );
  };

  //const [data, setData] = useState(defaultValue);
  const { TableForm } = useTableFormHook();
  TableForm.setForm({form, nameTable});
  const [editingKey, setEditingKey] = useState("");
  const [edittingNewKey, setEditingNewKey] = useState(false);

  const isEditing = (record: any) => {
    return record.key === editingKey;
  };
  const deleteRecord = (key) => {
    let newData = TableForm.getData({nameTable:nameTable}).filter((item) => item.key !== key);
    newData = newData.map((item, index) => ({ ...item, key: String(index) }));
    TableForm.setData({newData, nameTable});
    setEditingKey("");
    form.resetFields();
    TableForm.refresh();
    TableForm.setIsEditing({isEditing:false, nameTable});
    setEditingNewKey(false);
  };

  // add operation column
  const operationColumn = {
    title: t("pages:action"),
    dataIndex: "operation",
    fixed: 'right',
    // width: 150,
    render: (_: any, record: any) => {
      const editable = isEditing(record);
      const saveBtn = (
        <Tooltip placement="top" title={t("buttons:save")}>
          <Button type="primary" style={{ marginRight: 8 }} size="small" icon={<SaveOutlined />} onClick={() => save(record.key)} />
        </Tooltip>

      );
      const deleteBtn = (
        <Popconfirm
          title={t("pages:delete_confirm")}
          onConfirm={() => deleteRecord(record.key)}
        >
          <Tooltip placement="top" title={t("buttons:delete")}>
            <Button danger size="small" style={{ marginRight: 8 }} icon={<DeleteOutlined />} />
          </Tooltip>

        </Popconfirm>
      );
      const cancelBtn = (
        <Popconfirm title={t("pages:cancel_confirm")} onConfirm={cancel}>
          <Tooltip placement="top" title={t("buttons:cancel")}>
            <Button danger size="small" icon={<CloseSquareOutlined />} />
          </Tooltip>
        </Popconfirm>
      );
      const editBtn = (
        <Typography.Link
          disabled={editingKey !== ""}
          onClick={() => edit(record)}
          style={{ marginRight: 8 }}
        >
          <EditOutlined />
        </Typography.Link>
      );
      return editable ? (
        <span>
          {saveBtn}
          {!disabled.includes('delete')?deleteBtn:''}
          {cancelBtn}
        </span>
      ) : (
        <span>
          {!disabled.includes('edit')?editBtn:""}
          {editingKey !== "" ? "" : !disabled.includes('delete')?deleteBtn:''}
        </span>
      );
    },
  };
  columns = columns
    .filter((item) => item.dataIndex !== "operation");
  if(!disabled.includes('delete') || !disabled.includes('edit')) {
    columns.push(operationColumn)
  }


  const edit = (record) => {
    setEditingKey(record.key);
    setEditingNewKey(false);
    form.setFieldsValue(record);
    TableForm.setIsEditing({isEditing:true, nameTable});
  };

  const cancel = async () => {
    if (!edittingNewKey) {
      form.resetFields();
      setEditingKey("");
      setEditingNewKey(false);
      TableForm.setIsEditing({isEditing:false, nameTable});
    } else {
      deleteRecord(editingKey);
    }

  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as any;

      const newData = TableForm.getData({nameTable:nameTable});
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }

      TableForm.setData({newData, nameTable});

      setEditingKey("");
      setEditingNewKey(false);
      form.resetFields();
      TableForm.setIsEditing({isEditing:false, nameTable});
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const add = () => {
    let data = TableForm.getData({nameTable:nameTable});
    const key = String(data.length);
    form.resetFields();
    data.push({ key });
    TableForm.setData({newData:[...data],nameTable:nameTable});
    TableForm.setIsEditing({isEditing:true, nameTable});
    TableForm.refresh();
    setEditingKey(key);
    setEditingNewKey(true);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // useEffect(() => {
  //   TableForm.clear({nameTable:nameTable});
  // }, []);

  return (
    <div>
      <Table
        components={{
          body: {
            cell: customInput,
          },
        }}
        bordered
        dataSource={[...TableForm.getData({nameTable:nameTable})]}
        columns={mergedColumns}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      { !disabled.includes('add') &&
        <Button
          type="primary"
          disabled={TableForm.getData({nameTable:nameTable}).length  === 0? false :  Boolean(editingKey)}
          onClick={add}
          style={{ marginTop: "8px" }}
        >
          <PlusCircleOutlined />
          Thêm
        </Button>
      }

    </div>
  );
};

export default EditableTable;
