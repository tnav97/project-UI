export interface IPickInvoice {
  icon: string;
  label: string;
  selected: boolean;
  value: number | string;
}
export interface IInvoice {
  _id: string;
  index: number;
  invoiceId: string;
  company: string;
  companyEmail: string;
  companyPhone: string;
  clientCompany: string;
  clientCompanyEmail: string;
  clientCompanyPhone: string;
  projectTitle: string;
  department: string;
  amtBalance: string;
  invoiceDate: string;
  paymentDueDate: string;
  statusDetail: string;
  tasks: ITask[];
  weekStarts: string;
  contractName: string;
  totalHours: string;
  client: string;
  status: string;
  fromVendor: string;
  paidDate: string;
}

export interface ITask {
  id: number;
  taskDesc: string;
  totalHours: string;
  rate: string;
  amt: string;
}
