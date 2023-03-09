import useBaseHooks from "@root/src/hooks/BaseHook";
import {
  Input,
  Form,
} from "antd";
import { validations } from "@src/config/ListVadidations";


const TextInputField = ({fieldGroup }:{fieldGroup:{
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
      name={fieldGroup.fieldName}
      rules={listValidations}
    >
      <Input.TextArea placeholder={fieldGroup.label} />
    </Form.Item> 
  );
};

export default TextInputField;