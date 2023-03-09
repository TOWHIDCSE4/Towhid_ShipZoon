import React, { useState } from "react";
import { Button, Form, Col, Row } from "antd";
import userTempsService from "@root/src/services/userTempService";
import useBaseHook from "@src/hooks/BaseHook";
import { SaveFilled } from "@ant-design/icons";
import dynamic from "next/dynamic";
import UserInformationForm from "@root/src/components/Admin/Users/UserInformationForm";
const Layout = dynamic(() => import("@src/layouts/Login"), { ssr: false });
import to from "await-to-js";
import moment from "moment-timezone";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 }, 
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};


const CreateTemp = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { query } = router;
  const token = query.token;

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true);
    let data = { ...values, token: token, birthday: moment(values.birthday).format("YYYY-MM-DD") };

    let [error, result]: any[] = await to(
      userTempsService().updateUserTemp(data)
    );

    setLoading(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordUserCreated"));
    redirect("frontend.admin.login");
    return result;
  };

  return (
    <>
      <div className="content-form" style={{paddingTop:0}}>
        <div style={{textAlign:'center'}}>
        <div className="img">
            <img style={{width:245}}  src={publicRuntimeConfig.LOGO}></img>
          </div>
        </div>
        <div className="form-registration" id="registration" style={{boxShadow:"0 0 4px 1px #aba8a7"}}>
          <div className="content-form-login">
            <div className="sitename-title">{t("pages:userTemp.createTemp.title")}</div>
            <div className="sitename">
              {t("pages:userTemp.createTemp.description")}
            </div>
          </div>
          <Form
            form={form}
            {...formItemLayout}
            name="createAdmin"
            layout="vertical"
            initialValues={{ }}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Row>
              <Col md={{ span: 16, offset: 4 }}>
                <UserInformationForm form={form} />
                <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{width:200,height:40,background:'linear-gradient(90deg, rgb(94 93 185) 0%, rgb(89 104 169) 35%, rgb(63 113 124) 100%)' }}
                    className="btn-margin-right"
                  >
                    <SaveFilled /> {t("buttons:submit")}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

CreateTemp.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:users.create.title")}
      description={t("pages:users.create.description")}
      {...props}
    />
  );
};

export default CreateTemp;