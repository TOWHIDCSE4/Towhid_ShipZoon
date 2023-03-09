import useBaseHooks from "@root/src/hooks/BaseHook";
import {
  Radio,
  Form,
} from "antd";
import { validations } from "@src/config/ListVadidations";


const CheckboxField = ({fieldGroup }:{fieldGroup:{
  label: string,
  fieldName: string,
  validations: string[],
  radioSelect: [{
    label: string,
    value: string,
  }],
}}) => {
  const { t } = useBaseHooks();  
  let options = [];
  fieldGroup?.radioSelect?.forEach((item,index) => {
    options.push(<Radio key={String(index)+String(item.value)}  value={item.value}>{item.label}</Radio>)
  })  
  let listValidations = fieldGroup?.validations?.map((item) => {
    return validations({name:fieldGroup.label,validation:item,t:t})
    }) || []; 
  return (
    <Form.Item
      label={fieldGroup.label}
      name={fieldGroup.fieldName}
      rules={listValidations}
    >
      <Radio.Group>
        {options}
      </Radio.Group>
    </Form.Item> 
  );
};

export default CheckboxField;