import useBaseHooks from "@root/src/hooks/BaseHook";
import { Upload, Form } from "antd";
const { Dragger } = Upload;
import { InboxOutlined } from "@ant-design/icons";
import { validations } from "@src/config/ListVadidations";
import validatorHook from "@root/src/hooks/ValidatorHook";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';


const FileInputField = ({
  fieldGroup,
  form,
}: {
  fieldGroup: {
    label: string;
    fieldName: string;
    validations: string[];
    validationTypeFileUpload?: any[];
    validationSizeFileUpload?: number;
    validationNumberFileUpload?: number;
  };
  form: any;
}) => {
  const { t } = useBaseHooks();
  let listValidations =
    fieldGroup?.validations?.map((item) => {
      return validations({ 
        name: fieldGroup.label, 
        validation: item, 
        t: t,
        arrType: fieldGroup.validationTypeFileUpload || [],
        validationSizeFileUpload: fieldGroup.validationSizeFileUpload || 1,
        validationNumberFileUpload: fieldGroup.validationNumberFileUpload || 1,
      });
    }) || [];
  let defaultFileList = [];
  let dataForm = form.getFieldValue(fieldGroup.fieldName);
  if (Array.isArray(dataForm)) {
    defaultFileList = dataForm;
  } else if (
    typeof dataForm === "object" &&
    !Array.isArray(dataForm) &&
    dataForm !== null &&
    Array.isArray(dataForm.fileList) &&
    dataForm.fileList.length
  ) {
    defaultFileList = dataForm.fileList;
  }

  const onChange = (info) => {
    info.file.status = 'done';
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if(file && ['png','jpg','jpeg'].includes(file.name?.split('.')[file.name?.split('.')?.length - 1]?.toLocaleLowerCase())){
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as RcFile);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    }else {
      var link=document.createElement('a');
      link.href = src;
      link.download = src;
      link.click();
    }
  };

  return (
    <Form.Item
      label={fieldGroup.label}
      name={fieldGroup.fieldName}
      rules={[
        ...listValidations,
      ]}
    >
      <Dragger
        multiple
        className="width-button"
        defaultFileList={defaultFileList}
        listType='picture'
        accept={fieldGroup?.validations?.includes('type_file_upload') ?fieldGroup?.validationTypeFileUpload?.toString() : 'image/*'}
        onPreview={onPreview}
        onChange={onChange}
        action={'https://www.mocky.io/v2/5cc8019d300000980a055e76'}
      >
        <div>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t("pages:upload.choose")}</p>
          <p className="ant-upload-hint">{t("pages:upload.description")}</p>
        </div>
      </Dragger>
    </Form.Item>
  );
};

export default FileInputField;
