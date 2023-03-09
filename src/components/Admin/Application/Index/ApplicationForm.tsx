import {
  AlignCenterOutlined,
  ArrowRightOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import useBaseHooks from "@root/src/hooks/BaseHook";
import useStatusCount from "@root/src/hooks/StatusCount";
import documentTemplateService from "@root/src/services/documentTemplateService";
import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Row,
  Skeleton,
  Space,
  Statistic,
  Dropdown
} from "antd";
import Meta from "antd/lib/card/Meta";
import to from "await-to-js";
import { useEffect, useState } from "react";
import usePermissionHook from "@src/hooks/PermissionHook";
const { Search } = Input;
import type { MenuProps } from 'antd';

const ApplicationForm = () => {
  const { t, redirect, notify } = useBaseHooks();
  const status = useStatusCount();
  const [documentTemplateFrom, setDocumentTemplateFrom] = useState(null);
  const [currentpage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { checkPermission } = usePermissionHook();

  const createPerDoc = checkPermission({
    "documents": "C"
  })

  const onInputChange = async (e) => {
    e.preventDefault();
    await onSearch(e.target.value);
  };
  const onSearch = async (value: string) => {
    setLoading(true);
    setDocumentTemplateFrom(null);

    const values: any = {};

    values.sorting = [{ field: "document_templates.id", direction: "desc" }];

    values.filters = [
      {
        field: "document_templates.name",
        operator: "contains",
        value: value,
      },
    ];

    values.pageSize = 4;

    let [error, documentTemplateFromObject]: [any, any] = await to(
      documentTemplateService().withAuth().index(values)
    );

    if (error) return notify(t(`errors:${error.code}`), "", "error");
    setDocumentTemplateFrom(documentTemplateFromObject?.data);
    setTotal(parseInt(documentTemplateFromObject.total));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  /**
   * page change on pagination
   * @params {page,pageSize}
   * @returns
   */

  const onPageChange = async (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const fetchData = async () => {
    const values: any = {};
    values.page = currentpage === 0 ? currentpage : currentpage - 1;
    values.pageSize = pageSize;

    values.sorting = [{ field: "document_templates.id", direction: "desc" }];

    let [error, documentTemplateFromObject]: [any, any] = await to(
      documentTemplateService().withAuth().getTemplate(values)
    );

    if (error) return notify(t(`errors:${error.code}`), "", "error");
    setDocumentTemplateFrom(documentTemplateFromObject?.data);
    setTotal(parseInt(documentTemplateFromObject.total));
  };

  const items: MenuProps['items'] = [
    // {
    //   key: '1',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer">
    //       Name
    //     </a>
    //   ),
    // },
    // {
    //   key: '2',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" >
    //       Created At
    //     </a>
    //   ),
    // },
    // {
    //   key: '3',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" >
    //       locate
    //     </a>
    //   ),
    // },
  ];


  useEffect(() => {
    fetchData();
  }, [currentpage]);

  return (
    <>
      <Row gutter={16}>
        <Col md={12} xs={24}>
          <Card
            type="inner"
            title="Form List"
            onClick={() => createPerDoc ? redirect("frontend.admin.documents.index") : ''}
            extra={<a>{t("pages:documents.documentForm.view")}</a>}
          >
            <Row>
              <Col md={6} xs={12}>
                <Statistic
                  title={t("pages:documents.documentForm.submitted")}
                  value={status["Submitted"]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Statistic
                  title={t("pages:documents.documentForm.approve")}
                  value={status["Approve"]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Statistic
                  title={t("pages:documents.documentForm.inReview")}
                  value={status["To Be Reviewed"]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Statistic
                  title={t("pages:documents.documentForm.rejected")}
                  value={status["Rejected"]}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card
            type="inner"
            title="Form Draft"
            onClick={() => createPerDoc ? redirect("frontend.admin.documents.index") : ''}
            extra={<a>{t("pages:documents.documentForm.view")}</a>}
          >
            <Statistic
              title={t("pages:documents.documentForm.draft")}
              value={status["Draft"]}
            />
          </Card>
        </Col>
      </Row>
      <br />
      <Card type="inner">
        <Row>
          <Col md={12} xs={24}>
            <Space>
              {/* <Dropdown menu={{ items }} placement="bottomRight" arrow> */}
              <Button>
                <AlignCenterOutlined /> More Filter
              </Button>
              {/* </Dropdown> */}
            </Space>
          </Col>
          <Col md={12} xs={24}>
            <Search
              placeholder="Search"
              className="btn-right"
              onSearch={onSearch}
              onChange={onInputChange}
            />
          </Col>
        </Row>
      </Card>
      <Card
      style={{ height: "320px" }}
      >
        {loading ? (
          <Skeleton />
        ) : (
          <Row gutter={8} style={{ gap: "20px" }}>
            {documentTemplateFrom?.map((documentTemplate: any,index) => {
              return (
                <Card
                  hoverable
                  key={index}
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="anh-nen"
                      src="https://img.freepik.com/free-vector/vibrant-summer-ombre-background-vector_53876-105765.jpg?w=2000"
                    />
                  }
                >
                  <Meta
                    title={documentTemplate?.name}
                    description={documentTemplate?.description}
                  />
                  <br />
                  <Button
                    type="primary"
                    onClick={() => {
                      redirect("frontend.admin.documents.create", { id: documentTemplate.code })
                    }}
                  >
                    {t("pages:documents.documentForm.apply")}{" "}
                    <ArrowRightOutlined />
                  </Button>
                </Card>
              );
            })}
          </Row>
        )}
      </Card>
      <br />

      <div className="text-center">
        {loading ? (
          <Skeleton.Button />
        ) : (
          <Pagination
            total={total}
            defaultCurrent={1}
            pageSize={pageSize}
            current={currentpage}
            onChange={onPageChange}
          />
        )}
      </div>
    </>
  );
};

export default ApplicationForm;