import useBaseHooks from "@root/src/hooks/BaseHook";
import {
  InputNumber,
  Form,
} from "antd";
import { validations } from "@src/config/ListVadidations";
const NumberInputField = ({ fieldGroup }: {fieldGroup:{
  label: string,
  fieldName: any,
  validations: String[],
  validationMax: number,
}}) => {
  const { t } = useBaseHooks(); 
  let listValidations = fieldGroup?.validations?.map((item) => {
    return validations({name:fieldGroup.label,validation:item,t:t})
    }) || [];    
  return (
    <>
    {
      <Form.Item
        label={fieldGroup.label}
        name={fieldGroup.fieldName}
        rules={listValidations}
      >
        <InputNumber max={fieldGroup?.validations?.includes('max') ?fieldGroup.validationMax : null} style={{width:'100%'}} placeholder={fieldGroup.label} />
      </Form.Item> 
    }
    </>
    
  );
};

export default NumberInputField;