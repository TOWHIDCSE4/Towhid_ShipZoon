import { useRouter } from 'next/router'
import I18n from '@libs/I18n'
import { useDispatch, useSelector } from 'react-redux'
import { setStore as setStoreAction } from '@src/components/Redux/Store'
import _ from 'lodash'
import { notification, Tag } from 'antd'
import { makeUrl, getRouteData } from '@src/helpers/routes';
import to from 'await-to-js'

interface BaseBook {
  useSelector: Function,
  router: any,
  t: Function,
  setStore: Function,
  getStore: Function,
  redirect: Function,
  getData: Function,
  notify: Function,
  TagDefaut: Function,
  sprintf: Function
  handleApi: Function,
  getCookies: Function
}
const useBaseHooks = (
  {
    lang = ['common'],
  }: { lang?: string[], } = {}): BaseBook => {
  const router = useRouter()
  const translatetion = I18n.useTranslation(lang)
  const dispatch = useDispatch();

  const setStore = async (path: string, value: any): Promise<any> => {
    return dispatch(setStoreAction(path, value))
  }

  const getStore = (path: string): any => {
    return useSelector((state: any) => _.get(state, path))
  }

  const redirect = async (url: string, query: any, shallow: boolean = false) => {
    const routeData = await getRouteData()
    let nextRoute;
    try {
      nextRoute = makeUrl(url, query, routeData)
    }
    catch (e) {
      nextRoute = {
        href: url,
        as: url
      }
    }
    router.push(nextRoute.href, nextRoute.as, {
      shallow
    })
  }

  const getData = (obj: any, path: string, defaultValue: any = undefined): any => {
    let value = _.get(obj, path, defaultValue)
    if (value == null) return defaultValue
    return value
  }

  const notify = (message: string, description: string = '', type: 
    "success" |
    "error" |
    "warning"|
    'info'
  ): void => {
    if(type){
      notification[type]({
        message: message,
        description: description,
        duration: 4, //second
      });
    }else {
      notification.success({
        message: message,
        description: description,
        duration: 4, //second
      });
    }
  }


  const sprintf = (message: string, keys: any) => {
    const regexp = /{{([^{]+)}}/g;
    let result = message.replace(regexp, function (ignore, key) {
      return (key = keys[key]) == null ? '' : key;
    });
    return result;
  }

  const TagDefaut = ({message,type,icon}:{message:string,type:string,icon?:any}) => {
    if (type = 'primary') {
      return (
      <Tag icon={icon} color="#405189">
        {message}
      </Tag>)
    }
    if (type = 'success') {
      return (
      <Tag icon={icon} color="#0AB39C">
        {message}
      </Tag>)
    }
    if (type = 'info') {
      return (
      <Tag icon={icon} color="#299CDB">
        {message}
      </Tag>)
    }
    if (type = 'warning') {
      return (
      <Tag icon={icon} color="#F7B84B">
        {message}
      </Tag>)
    }
    if (type = 'error') {
      return (
      <Tag icon={icon} color="#F06548">
        {message}
      </Tag>)
    }
    if (type = 'dark') {
      return (
      <Tag icon={icon} color="#212529">
        message
      </Tag>)
    }
    else {
      return (
        <Tag icon={icon} color="#3577F1">
          {message}
        </Tag>)
    }
  }

  const handleApi = async (apiFunc) => {
    if (typeof apiFunc !== 'function') return null;

    let [error, result]: any[] = await to(apiFunc());
    if (error) return notify(translatetion.t(`errors:${error.code}`), '', 'error');
    return result
  }

  const getCookies = (): any => {
    return useSelector((state: any) => state.cookies)
  }

  return {
    useSelector,
    router,
    t: translatetion.t,
    setStore,
    getStore,
    redirect,
    getData,
    notify,
    TagDefaut,
    sprintf,
    handleApi,
    getCookies
  };
}

useBaseHooks.getData = (obj: any, path: string, defaultValue: any = undefined): any => {
  let value = _.get(obj, path, defaultValue)
  if (value == null) return defaultValue
  return value
}

export default useBaseHooks
