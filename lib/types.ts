// Types for the application

export interface Invoice {
  id: string;
  businessId: string;
  client: string;
  issueDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'PartiallyPaid';
  currency: 'USD' | 'EUR' | 'UAH';
  total: number;
  balanceDue: number;
}

export interface InvoiceDetail extends Invoice {
  contact: string;
  lineItems: LineItem[];
  payments: Payment[];
}

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  date: string;
  method: string;
  amount: number;
  currency: string;
}

export interface Debtor {
  client: string;
  overdueInvoices: number;
  balanceDue: number;
  currency: string;
}

export interface CreateInvoiceData {
  clientId: string;
  terms: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceResult {
  id: string;
  businessId: string;
}
