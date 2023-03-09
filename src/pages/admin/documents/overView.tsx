import React from 'react'
import dynamic from 'next/dynamic';
import useBaseHook from '@src/hooks/BaseHook'
import ApplicationForm from '@root/src/components/Admin/Application/Index/ApplicationForm';

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const Index = () => {

  return (
    <div className="content">
      <ApplicationForm />
    </div>
  )
}

Index.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:documents.overView.title")}
    description={t("pages:documents.overView.description")}
    {...props}
  />
}

Index.permissions = {
  documents: 'C'
}

export default Index