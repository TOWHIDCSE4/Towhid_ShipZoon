import useBaseHooks from "@root/src/hooks/BaseHook";
import {
  DatePicker,
  Form,
} from "antd";
import { validations } from "@src/config/ListVadidations";


const TextInputField = ({fieldGroup ,form}:{fieldGroup:{
  label: string,
  fieldName: string,
  validations: String[],
},form:any}) => {
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
      <DatePicker style={{width:'100%'}} format="YYYY/MM/DD" showTime/>
    </Form.Item> )
};

export default TextInputField;