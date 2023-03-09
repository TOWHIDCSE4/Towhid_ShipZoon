import useBaseHooks from "@root/src/hooks/BaseHook";
import {
  Checkbox,
  Form,
} from "antd";
import { validations } from "@src/config/ListVadidations";


const CheckboxField = ({fieldGroup }:{fieldGroup:{
  label: string,
  fieldName: string,
  validations: string[],
}}) => {
  const { t } = useBaseHooks();  
  let listValidations = fieldGroup?.validations?.map((item) => {
    return validations({name:fieldGroup.label,validation:item,t:t})
    }) || [];   
  return (
    <Form.Item
      label={fieldGroup.label}
      valuePropName="checked"
      name={fieldGroup.fieldName}
      rules={listValidations}
    >
      <Checkbox />
    </Form.Item> 
  );
};

export default CheckboxField;