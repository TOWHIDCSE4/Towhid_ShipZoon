import useBaseHooks from "@root/src/hooks/BaseHook";
import {useEffect,useState} from "react";
import {
  Select,
  Form,
} from "antd";
import { validations } from "@src/config/ListVadidations";
const { Option } = Select;

const SelectInputField = ({fieldGroup }:{fieldGroup:{
  label: string,
  fieldName: string,
  validations: string[],
  listSelect: {
    source: any[],
    sourceType: String,
  }
}}) => {
  const { t } = useBaseHooks();
  let listOptions = [];
    listOptions = fieldGroup?.listSelect?.source || []
  let listValidations = fieldGroup?.validations?.map((item) => {
    return validations({name:fieldGroup.label,validation:item,t:t})
    }) || []; 
  return (
    <Form.Item
      label={fieldGroup.label}
      name={fieldGroup.fieldName}
      rules={ listValidations}
    >
      <Select 
        style={{width:'100%'}}
        allowClear
        showSearch 
        placeholder={fieldGroup.label} 
        options={listOptions} />
    </Form.Item> 
  );
};

export default SelectInputField;