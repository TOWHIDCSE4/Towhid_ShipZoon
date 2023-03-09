import React from "react";
import { Form, Input, Row, Col, Select,Switch } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import validatorHook from "@src/hooks/ValidatorHook";
import { SyncOutlined } from "@ant-design/icons";
import roleService from "@src/services/roleService";
import tenantService from "@src/services/tenantService";
import useSWR from "swr";
import auth from "@src/helpers/auth";
import _ from "lodash";
import { randompass } from '@src/helpers/utils'

const { Option } = Select;

const UserFormTemp = ({ form, isEdit, isTenant = false, }: { form: any; isEdit: boolean; isTenant?: boolean; }) => {
  const { t, getData } = useBaseHook();
  const { CustomRegex,mail } = validatorHook();
  const { data: dataT } = useSWR("groupSelect2", () =>
    roleService().withAuth().select2({ pageSize: -1 })
  );
  const { data: dataC } = useSWR("tenants", () =>
    tenantService().withAuth().index({ pageSize: -1 })
  );

  let tenant = _.get(dataC, "data", []);
  const roles = getData(dataT, "data", []);

  const randompassWord = () => {
		let result = randompass();
		form.setFieldsValue({ password: result });
	};

  return (
    <Row gutter={[24, 0]}>
      {isTenant ? (
        <>
          <Col md={12}>
            <Form.Item
              label={t("pages:users.form.lastName")}
              name="lastName"
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
          <Col md={12}>
            <Form.Item
              label={t("pages:users.form.firstName")}
              name="firstName"
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
        </>
      ) : null}

      <Col md={22}>
        <Form.Item
          label={t("pages:users.form.email")}
          name="email"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.email"),
              }),
            },
            // { type: "email", message: t("messages:form.email") },
            {
              max: 100,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.email"),
                length: 100,
              }),
            },
            mail({message:t("messages:form.email")})
          ]}
        >
          <Input
            placeholder={t("pages:users.form.email")}
          />
        </Form.Item>
      </Col>
      <Col md={2}>
        <Form.Item
          label={t("pages:users.form.twofa")}
          name="twofa"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Col>
      {!isEdit ? (
        <>
          <Col md={24}>
            <Form.Item
              label={t("pages:users.form.password")}
              name="password"
              rules={[
                {
                  required: true,
                  message: t("messages:form.required", {
                    name: t("pages:users.form.password"),
                  }),
                },
              ]}
            >
              <Input
                placeholder={t("pages:users.form.password")}
                autoComplete="off"
                addonBefore={
                  <div
                    style={{ width: " 100%" }}
                    onClick={() => randompassWord()}
                  >
                    <SyncOutlined />
                  </div>
                }
                disabled
              />
            </Form.Item>
          </Col>
        </>
      ) : null}

      {!isEdit && !isTenant ? (
        <>
          <Col md={24}>
            <Form.Item
              label={t("pages:users.form.role")}
              name="roleId"
              rules={[
                {
                  required: true,
                  message: t("messages:form.required", {
                    name: t("pages:users.form.role"),
                  }),
                },
              ]}
            >
              <Select
                placeholder={t("pages:users.form.role")}
                allowClear
                showSearch
              >
                {roles.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </>
      ) : null}

      {auth().user.permissions.root && !isTenant ? (
        <Col md={24}>
          <Form.Item
            label={t("pages:users.form.tenant")}
            name="tenantId"
            rules={[
              {
                required: true,
                message: t("messages:form.required", {
                  name: t("pages:users.form.tenant"),
                }),
              },
            ]}
          >
            <Select
              placeholder={t("pages:users.form.tenant")}
              allowClear
              showSearch
            >
              {tenant.map((item: any) => (
                <Option value={item.id} key={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      ) : (
        ""
      )}
    </Row>
  );
};

export default UserFormTemp;