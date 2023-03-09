import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import useBaseHook from '@src/hooks/BaseHook'
import { SelectOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const PowerBi = () => {
  const refIframe = useRef();
  const { t, notify, redirect, router } = useBaseHook();

  let url = `https://app.powerbi.com/reportEmbed?reportId=214839c3-a671-4988-aadb-5beb367f3c5a&autoAuth=true&ctid=3c1f87d9-61a6-49e4-934c-ddf9a46c2c0f`;

  useEffect(() => {
    // let host = 'http://localhost:3000';
    // host = 'https://chart.kddi.mqsolutions.vn'

    if (refIframe && refIframe.current) {
      var ifApp = document.querySelector('#my-app');
      ifApp.setAttribute('src', url);
    }
  },)

  const text = <span>Open in new tab</span>;

  const openTab = () => {
    window.open(url)
  }
  return <>
    <div className="content" >
      <div style={{ width: '100%', minHeight: 'calc(100vh - 70px)', position: 'relative' }}>
        <iframe ref={refIframe} src="" id="my-app"
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        ></iframe>
      </div>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Tooltip placement="left" title={text}>
          <Button onClick={openTab} type="primary" ><SelectOutlined /></Button>
        </Tooltip>
      </div>
    </div>
  </>
}

PowerBi.Layout = (props) => {
  const { t } = useBaseHook();
  return <Layout
    title={t("pages:powerBi.index.title")}
    description={t("pages:powerBi.index.description")}
    {...props}
  />
}

PowerBi.permissions = {
  "Power_bi": "R"
};

export default PowerBi
