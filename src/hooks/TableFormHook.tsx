import { useState } from "react";
import _ from "lodash";
import useBaseHooks from "./BaseHook";
import to from 'await-to-js';


const TableFormHook = () => {
  const [reload, setReload] = useState(false);
  const { notify, t } = useBaseHooks();

  const setData = ({nameTable,newData}:{nameTable:string,newData:any}) => {
    if(newData) {
      TableFormHook.formData[nameTable] = JSON.parse(JSON.stringify([...newData].map((item, index) => ({ ...item, key: item.key || String(index) }))));
    }else {
      TableFormHook.formData[nameTable] = JSON.parse(JSON.stringify([]));
    }
  };

  const getData = ({nameTable}:{nameTable:string}) => {
    return TableFormHook.formData[nameTable] || [];
  };

  const setForm = ({nameTable,form}:{nameTable:string,form:any}) => {
    TableFormHook.form[nameTable] = form;
  }
  const setRequiredFields = ({requiredFields,nameTable}:{nameTable:string,requiredFields:any}) => {
    TableFormHook.requiredFields[nameTable] = requiredFields;
  }

  const checkRequiredFields = ({nameTable}:{nameTable:string}) => {
    let requiredFields = TableFormHook.requiredFields[nameTable] || [];
    (TableFormHook.formData[nameTable]||[]).map(item => {
      requiredFields.map(field => {
        if (!item[field]) {
          notify(t('messages:message.checkRequiredFields.' + field), "", "error")
          throw new Error(t('messages:message.checkRequiredFields'))
        }
      })
    })
  }

  const validate = async ({nameTable}:{nameTable:string}) => {
    checkRequiredFields({nameTable:nameTable});
    if (TableFormHook.isEditing[nameTable]) {
      notify(t('messages:message.saveTableBeforeSubmit'), "", "error");
      throw new Error(t('messages:message.saveTableBeforeSubmit'))
    }

    let [error, data] = await to((TableFormHook.form[nameTable] as any).validateFields());
    if (error) throw new Error(t('messages:message.pushDataFailed'));
    if ((TableFormHook.formData[nameTable] || []).length === 0) {
      notify(t('messages:message.pushDataFailed'), "", "error");
      throw new Error(t('messages:message.pushDataFailed'))
    }
    checkRequiredFields({nameTable:nameTable});
  }

  const validateAll = async () => {
    for (const [nameTable, value] of Object.entries(TableFormHook.formData)) {
      checkRequiredFields({nameTable:nameTable});
      if (TableFormHook.isEditing[nameTable]) {
        notify(t('messages:message.saveTableBeforeSubmit'), "", "error");
        throw new Error(t('messages:message.saveTableBeforeSubmit'))
      }
  
      let [error, data] = await to((TableFormHook.form[nameTable] as any).validateFields());
      if (error) throw new Error(t('messages:message.pushDataFailed'));
      if ((TableFormHook.formData[nameTable] || []).length === 0) {
        notify(t('messages:message.pushDataFailed'), "", "error");
        throw new Error(t('messages:message.pushDataFailed'))
      }
      checkRequiredFields({nameTable:nameTable});
    }
  }

  const setIsEditing = ({isEditing,nameTable}:{nameTable:string,isEditing:boolean}) => {
    TableFormHook.isEditing[nameTable]= isEditing;
  }

  const getRow = ({index,nameTable}:{index: number,nameTable:string}) => {
    return _.get(TableFormHook.formData[nameTable], index, {});
  };

  const setRow = ({index, data,nameTable}:{nameTable:string,index:number,data:any}) => {
    _.set(TableFormHook.formData[nameTable], index, { ...data });
  };

  const refresh = () => {
    setReload(!reload);
  };
  const clear = ({nameTable}:{nameTable:string}) => {
    setData({newData:[],nameTable:nameTable});
    refresh();
    setRequiredFields({requiredFields:[],nameTable});
  };

  const clearAll = () => {
    TableFormHook.formData = {};
    TableFormHook.form = {};
    TableFormHook.isEditing = {};
    TableFormHook.requiredFields = {};
    refresh();
  };

  const transform = ({
    field,
    formater,
    nameTable
  }: {
    field: string;
    formater: Function;
    nameTable: string;
  }) => {
    (TableFormHook.formData[nameTable] || []).map((item) => {
      _.set(item, field, formater(item));
    });
  };
  return {
    TableForm: {
      setData,
      getData,
      getRow,
      setRow,
      refresh,
      clear,
      transform,
      setForm,
      validate,
      setIsEditing,
      setRequiredFields,
      validateAll,
      clearAll
    },
  };
};
TableFormHook.formData = {};
TableFormHook.form = {};
TableFormHook.isEditing = {};
TableFormHook.requiredFields = {};
export default TableFormHook;
