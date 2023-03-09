import useBaseHooks from "@root/src/hooks/BaseHook";
import { Tabs, Form, Input } from "antd";
import ApplicationForm from "@root/src/components/Admin/Application/FieldItemTemplate/ApplicationForm";

const DetailForm = ({ documentTempale, form }) => {
  return (
    <>
      {documentTempale.map((group, index) => {
        return (
          <div key={String(index) + "detalFormdata"}>
            <ApplicationForm
              documentTempale={group?.GroupDefinition || []}
              form={form}
              disabled={["add", "edit", "delete"]}
            />
          </div>
        );
      })}
    </>
  );
};

export default DetailForm;
