export type IntentName =
  | "show_invoices"
  | "open_invoice"
  | "top_debtors"
  | "create_invoice";

export const INTENT_DEFS: Record<IntentName, {description: string; params: Record<string, string>}> = {
  show_invoices: {
    description: "List invoices for a recent period.",
    params: { periodDays: "number (e.g., 30|90|180)" }
  },
  open_invoice: {
    description: "Open invoice details by business id.",
    params: { businessId: "string like INV-#### (case-insensitive)" }
  },
  top_debtors: {
    description: "Rank customers by total balance due.",
    params: { limit: "optional number, default 10" }
  },
  create_invoice: {
    description: "Create a draft invoice.",
    params: {
      clientName: "string",
      items: "array of { description?: string, productName?: string, qty: number, unitPrice?: number }",
      terms: "string enum: Net 30|Net 15|Due on receipt"
    }
  }
};
