const roleKey = {
  root: 'root',
  admin: 'bsez_admin',
}
export const documentStatus = {
  1: 'Draft',
  2: 'Submitted',
  3: 'In Progress',
  4: 'Rejected',
  5: 'Approve',
}

const stateForm = ['Draft', 'BSEZ Employee', 'BSEZ Admin', 'Done']

const numberInMonth = {
  "01": 31,
  "02": 28,
  "03": 31,
  "04": 30,
  "05": 31,
  "06": 30,
  "07": 31,
  "08": 31,
  "09": 30,
  "10": 31,
  "11": 30,
  "12": 31
}

const numberInMonthProfit = {
  "01": 31,
  "02": 29,
  "03": 31,
  "04": 30,
  "05": 31,
  "06": 30,
  "07": 31,
  '08': 31,
  "09": 30,
  "10": 31,
  '11': 30,
  "12": 31
}

const default_premission = {
  users: 15,
  roles: 15,
  Power_bi: 4,
  documents: 15,
  invoices: 4,
}

const list_input_type = ['numberInput', 'textInput', 'dateTimeInput', 'selectInput', 'fileInput', 'textAreaInput', 'checkboxInput', 'radioInput', 'dateTimeShowTimeInput']

export default {
  roleKey, numberInMonth, numberInMonthProfit,default_premission, list_input_type, stateForm ,documentStatus
}

