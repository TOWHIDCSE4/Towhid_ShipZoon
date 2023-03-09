interface Tenant {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: number;
  address: string;
  state: string;
  others: User;
}



interface User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  roleId: number;
  createdAt: string;
  code: string;
  twofa: boolean;
  twofaKey: string;
  isFirst: number;
  tenantId: number;
  birthday: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  parentId: number;
  key: number;
  createdAt: string;
  code: string;
  permissions: Array[];
}

interface Invoice {
  id: number;
  invoiceName: string;
  partner_id: number;
  invoice_date: Date;
  monthly_consumption_id: number;
  amount_total: number;
  invoice_report_url: string;
}