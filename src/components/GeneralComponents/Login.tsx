import { LockOutlined, MailOutlined, LoginOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Checkbox } from 'antd'
import useBaseHook from '@src/hooks/BaseHook';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const Login = ({ onSubmit, loading, link, text, icon }: { onSubmit: Function, loading: any, link: string, text: string, icon: any }) => {
  const { t, redirect } = useBaseHook()
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    await onSubmit(values)
  }
  return (
    <div >
      <div className="content-form">
        <div className="logo">
          <div className="img">
            <img src={publicRuntimeConfig.LOGO}></img>
          </div>
          <div className="sitename">{t('pages:login.content')}</div>
        </div>
        <div className='form-login'>
          <div className="content-form-login">
            <div className="sitename-title">{t('pages:login.Welcome_Back')}</div>
            <div className="sitename">{t('pages:login.Sign_in_to_continue_to_KDDI')}</div>
          </div>
          <Form
            onFinish={onFinish}
            form={form}
            name="loginForm"
            layout="horizontal"
            initialValues={{
              email: localStorage.email,
              password: localStorage.password,
              otp: "",
              remember: localStorage.remember
            }}
          >
            <Col md={24} sm={24} xs={24}>
              <div style={{ marginBottom: 5, fontWeight: 600 }}>{t('pages:login.email')}</div>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: t('messages:form.required', { name: t('pages:login.email') }) },
                ]}
              >
                <Input
                  placeholder={t('pages:login.email')}
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
            <Col md={24} sm={24} xs={24}>
              <Row>
                <Col md={8}>
                  <div style={{ marginBottom: 5, fontWeight: 600 }}>{t('pages:login.password')}</div>
                </Col>
                <Col md={8} offset={8} style={{ textAlign: 'right' }}>
                  <a
                    className={`btn ${text}`}
                    onClick={() => redirect(link)}
                  >
                    {t(`buttons:${text}`)}?
                  </a>
                </Col>
              </Row>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: t('messages:form.required', { name: t('pages:login.password') }) },
                ]}
              >
                <Input.Password
                  placeholder={t('pages:login.password')}
                  prefix={<LockOutlined />}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col style={{fontWeight: 600 }} md={24} sm={24} xs={24}>
              <Form.Item 
                style={{ marginBottom: 3,marginTop:'-15px', fontWeight: 600 }} 
                name="remember" 
                valuePropName="checked">
                <Checkbox>{t('pages:login.remember_me')}</Checkbox>
              </Form.Item>
            </Col>

            <Col md={24} sm={24} xs={24}>
              <Form.Item>
                <Row gutter={12}>
                  {/* <Col md={12} sm={12} xs={12} style={{ marginBottom: 5 }}>
                </Col> */}
                  <Col md={24} sm={24} xs={24}>
                    <Button className="btn login" type="primary" htmlType="submit" loading={loading}>
                      <LoginOutlined />
                      {t('buttons:login')}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Form>
        </div>
      </div>

    </div>)
}

export default Login
