import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    defaultCurrency: v.string(),
    address: v.string(),
    industry: v.string(),
    country: v.string(),
    employeeCount: v.number(),
    foundedYear: v.number(),
    website: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  
  contacts: defineTable({
    clientId: v.id("clients"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.string(),
    isPrimary: v.boolean(),
  }),
  
  products: defineTable({
    name: v.string(),
    description: v.string(),
    unitPrice: v.number(),
    currency: v.string(),
    category: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  
  taxRates: defineTable({
    name: v.string(),
    percent: v.number(),
    isActive: v.boolean(),
  }),
  
  invoices: defineTable({
    businessId: v.string(),
    clientId: v.id("clients"),
    status: v.union(
      v.literal("Draft"),
      v.literal("Sent"),
      v.literal("Paid"),
      v.literal("Overdue"),
      v.literal("PartiallyPaid")
    ),
    issueDate: v.string(),
    dueDate: v.string(),
    currency: v.string(),
    total: v.number(),
    balanceDue: v.number(),
    notes: v.string(),
    paymentTerms: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  
  lineItems: defineTable({
    invoiceId: v.id("invoices"),
    productId: v.id("products"),
    description: v.string(),
    qty: v.number(),
    unitPrice: v.number(),
    total: v.number(),
    currency: v.string(),
  }),
  
  payments: defineTable({
    invoiceId: v.id("invoices"),
    amount: v.number(),
    currency: v.string(),
    method: v.string(),
    date: v.string(),
    reference: v.string(),
  }),
  
  exchangeRates: defineTable({
    base: v.string(),
    quote: v.string(),
    rate: v.number(),
    asOf: v.string(),
  }),
});
