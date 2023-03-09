import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  ProfileOutlined,
  FolderOpenOutlined,
  TagOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  NotificationOutlined,
  ApartmentOutlined,
  BlockOutlined,
  QuestionOutlined,
  SettingOutlined,
  HistoryOutlined,
  MinusOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  CommentOutlined,
  AreaChartOutlined,
  DashboardOutlined,
  GroupOutlined
} from "@ant-design/icons";

const sidebar = [
  {
    routeName: "frontend.admin.powerBi.index",
    icon: <AreaChartOutlined />,
    permissions: {
      Power_bi: "R",
    },
  },
  {
    routeName: "frontend.admin.documents.title",
    icon: <FileTextOutlined />,
    permissions: {
      documents: "R",
    },
    type: "sub",
    children: [
      {
        routeName: "frontend.admin.documents.overView",
        icon: <MinusOutlined />,
        permissions: {
          documents: 'C'
        },
      },
      {
        routeName: "frontend.admin.documents.index",
        icon: <MinusOutlined />,
        permissions: {
          documents: "R",
        },
      },
      // {
      //   routeName: "frontend.admin.documents.draft",
      //   icon: <MinusOutlined />,
      //   permissions: {
      //     overView: "R",
      //   },
      // }
    ]
  },
  {
    routeName: "frontend.admin.documentTemplates.index",
    icon: <TagOutlined />,
    permissions: {
      document_templates: "R",
    },
  },
  {
    routeName: "frontend.admin.invoices.index",
    icon: <FilePdfOutlined />,
    permissions: {
      invoices: "R",
    }
  },

  {
    routeName: "frontend.admin.users.title",
    icon: <UserOutlined />,
    routeParams: {},
    permissions: {
      users: "R",
    },
    type: "sub",
    children: [
      {
        routeName: "frontend.admin.users.index",
        icon: <MinusOutlined />,
        permissions: {
          users: "R",
        },
      },
      {
        routeName: "frontend.admin.roles.index",
        icon: <MinusOutlined />,
        permissions: {
          roles: "R",
        },
      },
      {
        routeName: "frontend.admin.tenants.index",
        icon: <MinusOutlined />,
        permissions: {
          tenants: "R",
        },
      },
    ]
  },
];

export default sidebar;
