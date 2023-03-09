import React , {useState} from "react";
import { Form, Input, Row, Col, DatePicker, Select, Upload } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import _ from "lodash";
const { Dragger } = Upload;
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import validatorHook from "@src/hooks/ValidatorHook";

const UserInformationForm = ({ form,admin }: { form?: any,admin?:any }) => {
  const { t } = useBaseHook();
  const { limitSizeImageDraggerSP,extensionDraggerImageSP }  = validatorHook();
  let defaultFileList = [];
  if(admin && admin.photo) {
    defaultFileList = [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: admin.photo,
      },
    ]
  }
  let arrType = ['image/jpeg','image/png','image/jpg'];
  const onChange = (info) => {
    info.file.status = 'done';
  }
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
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
  };

  return (
    <Row gutter={[24, 0]}>
      <Col md={12} xs={24}>
        <Form.Item
          label={t("pages:users.form.lastName")}
          name="lastName"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.lastName"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.lastName"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.lastName"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.lastName")} />
        </Form.Item>
      </Col>

      <Col md={12} xs={24}>
        <Form.Item
          label={t("pages:users.form.firstName")}
          name="firstName"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.firstName"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.firstName"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.firstName"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.firstName")} />
        </Form.Item>
      </Col>

      <Col md={12} xs={24}>
        <Form.Item
          label={t("pages:users.form.phone")}
          name="phone"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.phone"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.phone"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.phone"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.phone")} />
        </Form.Item>
      </Col>

      <Col md={12} xs={24}>
        <Form.Item
          label={t("pages:users.form.birthday")}
          name="birthday"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.birthday"),
              }),
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} placeholder={t("pages:users.form.birthday")} />
        </Form.Item>
      </Col>

      <Col md={12} xs={24}>
        <Form.Item
          label={t("pages:users.form.gender")}
          name="gender"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.gender"),
              }),
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("pages:users.form.gender")}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item
          label={t("pages:users.form.commuteMethod")}
          name="commuteMethod"
          labelAlign="left"
          rules={[
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.commuteMethod"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.commuteMethod")} />
        </Form.Item>
      </Col>
      <Col md={12} xs={24} xl={24} sm={12}> 
        <Form.Item
          label={t("pages:users.form.marriedStatus")}
          name="marriedStatus"
          labelAlign="left"
          rules={[
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.marriedStatus"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.marriedStatus")} />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          label={t("pages:users.form.avatar")}
          name="avatar"
          labelAlign="left"
          rules={[
            extensionDraggerImageSP(t('messages:form.extensionImgNotValid'), arrType),
            limitSizeImageDraggerSP(t('messages:form.ImgUploadIsTooBig', { max: 1 }),5),
          ]}
        >
          <Dragger
            className="width-button"
            maxCount={1}
            listType='picture'
            multiple = {false}
            defaultFileList={defaultFileList}
            onPreview={onPreview}
            onChange={onChange}
            accept=".jpg,.jpeg,.png"
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
      </Col>
    </Row>
  );
};

export default UserInformationForm;