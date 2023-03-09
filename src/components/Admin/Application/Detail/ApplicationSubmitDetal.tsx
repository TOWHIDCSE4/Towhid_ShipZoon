import useBaseHooks from "@root/src/hooks/BaseHook";
import { Tabs, Form, Input } from "antd";

const { TextArea } = Input;

const ApplicationSubmitDetal = ({
  disabled = {
    1: false,
    2: false,
    3: false,
    4: false,
  },
  defaultActiveKey = "1",
}: {
  disabled: {
    [key: string]: boolean;
  };
  defaultActiveKey?: string;
}) => {
  const { t, getData, router } = useBaseHooks();
  return (
    <Tabs
      defaultActiveKey= {defaultActiveKey}
      items={[
        {
          label: "BSEZ Admin Comments",
          key: "1",
          // disabled: disabled[1] && disabled[4],
          children: (
            <Form.Item name="comment_Your_Comments_Basic" rules={[]}>
              <TextArea
                disabled={disabled[1]}
                style={{ height: 150 }}
                placeholder={"Give Reasons if You Wish To Reject This Form"}
              />
            </Form.Item>
          ),
        },
        {
          label: "BSEZ employee Comments",
          key: "2",
          // disabled: disabled[2] && disabled[4],
          children: (
            <Form.Item name="comment_Tenant_Admin_Comments_Basic" rules={[]}>
              <TextArea
                disabled={disabled[2]}
                style={{ height: 150 }}
                placeholder={"Give Reasons if You Wish To Reject This Form"}
              />
            </Form.Item>
          ),
        },
        {
          label: "Issuer Comments",
          key: "3",
          // disabled: disabled[3] && disabled[4],
          children: (
            <Form.Item name="comment_Issuer_Comments_Basic" rules={[]}>
              <TextArea
                disabled={disabled[3]}
                style={{ height: 150 }}
                placeholder={"Give Reasons if You Wish To Reject This Form"}
              />
            </Form.Item>
          ),
        },
      ]}
    />
  );
};

export default ApplicationSubmitDetal;
