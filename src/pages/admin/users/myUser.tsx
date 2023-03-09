import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic';
import { Button, Form, Col, Row, Spin } from 'antd';
import userService from '@root/src/services/userService';
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled } from '@ant-design/icons';
import UserInformationForm from "@root/src/components/Admin/Users/UserInformationForm";
import moment from "moment-timezone";

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const MyUser = () => {
    const { t, notify, router } = useBaseHook();
    const [loading, setLoading] = useState(false);
    const [admin, setAdmin]: any[] = useState<User>();
    const [form] = Form.useForm();
    const [state, setChangeState] = useState(false);
    const [showUser, setshowUser] = useState(false);


    const fetchData = async () => {
        let [adminError, User]: [any, any] = await to(userService().withAuth().getInfo());
        if (adminError) return notify(t(`errors:${adminError.code}`), '', 'error')
        User.birthday = User?.birthday ? moment(User.birthday) : ''
        setAdmin(User)
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        fetchData()
    }, [state])

    //submit form

    const onFinish = async (values: any): Promise<void> => {
        let data = { ...values, birthday: moment(values.birthday).format("YYYY-MM-DD") };
        let [error, result]: any[] = await to(userService().withAuth().updateInfo({
            ...data
        }));
        if (error) return notify(t(`errors:${error.code}`), '', 'error')
        notify(t("messages:message.recordUserUpdated"))
        setshowUser(false)
        setChangeState(!state)
        return result
    };

    const changeState2Fa = async () => {
        setLoading(true)
        let [adminError, User]: [any, User] = await to(userService().withAuth().changeState2FA());
        if (adminError) return notify(t(`errors:${adminError.code}`), '', 'error')
        notify(t(`messages:message.Change_state_2FA_success`));
        setChangeState(!state)
        setLoading(false)
    }

    if (!admin) return <div className="content"><Spin /></div>
    return <>
        <div className="content">
            <Form
                form={form}
                layout="vertical"
                name="MyuserAdmin"
                initialValues={{
                    ...admin,
                    birthday: admin.birthday || '',
                }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Row>
                    <Col md={{ span: 16, offset: 4 }}>
                        <UserInformationForm form={form} admin={admin}/>
                        <Form.Item wrapperCol={{ span: 24 }} className="text-center">
                            <Button onClick={() => router.back()} className="btn-margin-right">
                                <LeftCircleFilled /> {t('buttons:back')}
                            </Button>
                            <Button className="btn-margin-right" key="back" type="primary" danger={admin.twofa ? true : false} loading={loading} onClick={changeState2Fa}>
                                {admin.twofa ? t("pages:infoUser.disable2FA") : t("pages:infoUser.enable2FA")}
                            </Button>
                            <Button className="btn-margin-right" key="submit" type="primary" loading={showUser} onClick={() => { form.submit() }}>
                                {t(`buttons:submit`)}
                            </Button>,
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    </>
}

MyUser.Layout = (props) => {
    const { t } = useBaseHook();
    return <Layout
        title={t("pages:users.myUser.title")}
        description={t("pages:users.myUser.description")}
        {...props}
    />
}
export default MyUser
