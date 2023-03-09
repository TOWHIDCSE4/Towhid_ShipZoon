import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { RightOutlined } from '@ant-design/icons';
import authService from '@src/services/authService'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook';
import auth from '@src/helpers/auth'
import LoginComponent from '@src/components/GeneralComponents/Login'
import Cookies from 'universal-cookie';

const Layout = dynamic(() => import('@src/layouts/Login'), { ssr: false })

const Login = () => {
  const { t, notify, redirect, getData, setStore ,getCookies } = useBaseHook()
  const [loading, setLoading] = useState(false)
  const cookieObject = getCookies()
  const cookies = new Cookies(cookieObject)

  useEffect(() => {
    cookies.remove("token", {
      path: "/"
    })
    cookies.remove("user", {
      path: "/"
    })
  }, [])

  const onFinish = async (values: any) => {
    setLoading(true)
    let [error, result]: any[] = await to(authService().login(values))
    setLoading(false)



    if (error) return notify(t('messages:message.loginFailed'), t(`errors:${error.code}`), 'error')
    if (values.remember && values.email !== "") {
      localStorage.email = values.email;
      localStorage.password = values.password;
      localStorage.remember = values.remember;
    }
    else if (!values.remember) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      localStorage.removeItem("remember");
    }
    auth().setAuth(result)
    notify(t('messages:message.loginSuccess'))
    if(result && result.user && !result.user.twofa) {
      redirect("frontend.admin.users.myUser")
    }else {
      redirect('frontend.admin.login.twofa')
    }
    return result
  }

  return <LoginComponent
    onSubmit={onFinish}
    loading={loading}
    link="frontend.admin.forgotPassword"
    icon={<RightOutlined />}
    text="forgotPassword"
  />
}

Login.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t('pages:login.title')}
    description={t('pages:login.description')}
    {...props}
  />
}

export default Login
