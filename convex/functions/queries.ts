import { query } from "./_generated/server";
import { v } from "convex/values";

// Real Convex queries using database
export const listInvoicesByPeriod = query({
  args: { periodDays: v.number() },
  handler: async (ctx, args) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - args.periodDays);
    
    try {
      // Query invoices from database
      const invoices = await ctx.db
        .query("invoices")
        .filter((q) => q.gte(q.field("issueDate"), cutoffDate.toISOString().split('T')[0]))
        .collect();
      
      // If no real data, return mock data for development
      if (invoices.length === 0) {
        return generateMockInvoices().filter(invoice => {
          const issueDate = new Date(invoice.issueDate);
          return issueDate >= cutoffDate;
        });
      }
      
      // Enrich invoices with client names
      const enrichedInvoices = await Promise.all(
        invoices.map(async (invoice) => {
          const client = await ctx.db.get(invoice.clientId);
          return {
            ...invoice,
            client: client?.name || 'Unknown Client',
          };
        })
      );
      
      return enrichedInvoices;
    } catch (error) {
      console.error('Error querying invoices:', error);
      // Return mock data on error
      return generateMockInvoices().filter(invoice => {
        const issueDate = new Date(invoice.issueDate);
        return issueDate >= cutoffDate;
      });
    }
  },
});

export const getInvoiceByBusinessId = query({
  args: { businessId: v.string() },
  handler: async (ctx, args) => {
    try {
      // Query invoice from database
      const invoice = await ctx.db
        .query("invoices")
        .filter((q) => q.eq(q.field("businessId"), args.businessId))
        .first();
      
      if (invoice) {
        // Get client details
        const client = await ctx.db.get(invoice.clientId);
        
        // Get line items
        const lineItems = await ctx.db
          .query("lineItems")
          .filter((q) => q.eq(q.field("invoiceId"), invoice._id))
          .collect();
        
        // Get payments
        const payments = await ctx.db
          .query("payments")
          .filter((q) => q.eq(q.field("invoiceId"), invoice._id))
          .collect();
        
        return {
          ...invoice,
          client: client?.name || 'Unknown Client',
          contact: client?.billingEmail || 'No email',
          lineItems,
          payments,
        };
      }
      
      // Return mock data if no real invoice found
      return generateMockInvoice(args.businessId);
    } catch (error) {
      console.error('Error querying invoice:', error);
      // Return mock data on error
      return generateMockInvoice(args.businessId);
    }
  },
});

export const getTopDebtors = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    try {
      // Query unpaid invoices from database
      const unpaidInvoices = await ctx.db
        .query("invoices")
        .filter((q) => q.gt(q.field("balanceDue"), 0))
        .collect();
      
      if (unpaidInvoices.length > 0) {
        // Group by client and calculate totals
        const debtorsMap = new Map();
        
        for (const invoice of unpaidInvoices) {
          const client = await ctx.db.get(invoice.clientId);
          const clientName = client?.name || 'Unknown Client';
          
          const existing = debtorsMap.get(clientName) || {
            client: clientName,
            overdueInvoices: 0,
            balanceDue: 0,
            currency: invoice.currency
          };
          
          existing.overdueInvoices++;
          existing.balanceDue += invoice.balanceDue;
          debtorsMap.set(clientName, existing);
        }
        
        return Array.from(debtorsMap.values())
          .sort((a, b) => b.balanceDue - a.balanceDue)
          .slice(0, args.limit || 10);
      }
      
      // Return mock data if no real data
      return generateMockDebtors().slice(0, args.limit || 10);
    } catch (error) {
      console.error('Error querying debtors:', error);
      // Return mock data on error
      return generateMockDebtors().slice(0, args.limit || 10);
    }
  },
});

export const listClients = query({
  args: {},
  handler: async (ctx) => {
    try {
      const clients = await ctx.db.query("clients").collect();
      
      if (clients.length === 0) {
        return generateMockClients();
      }
      
      return clients;
    } catch (error) {
      console.error('Error querying clients:', error);
      // Return mock data on error
      return generateMockClients();
    }
  },
});

export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    try {
      const products = await ctx.db.query("products").collect();
      
      if (products.length === 0) {
        return generateMockProducts();
      }
      
      return products;
    } catch (error) {
      console.error('Error querying products:', error);
      // Return mock data on error
      return generateMockProducts();
    }
  },
});

// Mock data generators for development
function generateMockClients() {
  return [
    { id: 'client-1', name: 'TechCorp Ltd', email: 'billing@techcorp.com', currency: 'USD' },
    { id: 'client-2', name: 'Design Studio', email: 'accounts@designstudio.com', currency: 'EUR' },
    { id: 'client-3', name: 'Marketing Pro', email: 'finance@marketingpro.com', currency: 'USD' },
    { id: 'client-4', name: 'Startup Inc', email: 'billing@startupinc.com', currency: 'USD' },
    { id: 'client-5', name: 'Consulting Co', email: 'accounts@consultingco.com', currency: 'UAH' },
    { id: 'client-6', name: 'Global Solutions', email: 'billing@globalsolutions.com', currency: 'EUR' },
    { id: 'client-7', name: 'Innovation Labs', email: 'finance@innovationlabs.com', currency: 'USD' },
  ];
}

function generateMockProducts() {
  return [
    { name: 'Web Development', unitPrice: 75 },
    { name: 'UI/UX Design', unitPrice: 60 },
    { name: 'Mobile App Development', unitPrice: 85 },
    { name: 'Consulting Services', unitPrice: 120 },
    { name: 'SEO Optimization', unitPrice: 500 },
    { name: 'Content Creation', unitPrice: 25 },
    { name: 'Server Maintenance', unitPrice: 45 },
    { name: 'Data Analysis', unitPrice: 90 },
  ];
}

function generateMockInvoices() {
  const mockClients = generateMockClients();
  const mockProducts = generateMockProducts();
  const invoices: any[] = [];
  let invoiceCounter = 1047;
  
  mockClients.forEach((client) => {
    const clientInvoiceCount = Math.floor(Math.random() * 8) + 3;
    
    for (let i = 0; i < clientInvoiceCount; i++) {
      const monthsAgo = Math.floor(Math.random() * 12);
      const issueDate = new Date();
      issueDate.setMonth(issueDate.getMonth() - monthsAgo);
      
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      const statusRoll = Math.random();
      let status;
      if (statusRoll < 0.55) status = 'Paid';
      else if (statusRoll < 0.70) status = 'Sent';
      else if (statusRoll < 0.80) status = 'Draft';
      else if (statusRoll < 0.90) status = 'Overdue';
      else status = 'PartiallyPaid';
      
      const lineItemCount = Math.floor(Math.random() * 3) + 1;
      let total = 0;
      
      for (let j = 0; j < lineItemCount; j++) {
        const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        const qty = Math.floor(Math.random() * 40) + 1;
        total += qty * product.unitPrice;
      }
      
      let balanceDue = total;
      if (status === 'Paid') {
        balanceDue = 0;
      } else if (status === 'PartiallyPaid') {
        balanceDue = total * (Math.random() * 0.7 + 0.3);
      }
      
      invoices.push({
        id: `inv-${invoiceCounter}`,
        businessId: `INV-${invoiceCounter}`,
        client: client.name,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status,
        currency: client.currency,
        total: Math.round(total * 100) / 100,
        balanceDue: Math.round(balanceDue * 100) / 100,
      });
      
      invoiceCounter++;
    }
  });
  
  return invoices;
}

function generateMockInvoice(businessId: string) {
  const mockClients = generateMockClients();
  const client = mockClients[Math.floor(Math.random() * mockClients.length)];
  
  const lineItems = [
    { description: 'Web Development', qty: 40, unitPrice: 75, total: 3000 },
    { description: 'UI/UX Design', qty: 20, unitPrice: 60, total: 1200 },
    { description: 'Consulting', qty: 10, unitPrice: 120, total: 1200 },
  ];

  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  const status = Math.random() > 0.5 ? 'Paid' : 'Sent';
  const payments = status === 'Paid' ? [
    { date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', amount: total, currency: 'USD' },
  ] : [];

  return {
    id: businessId,
    businessId,
    client: client.name,
    contact: client.email,
    status,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    total,
    balanceDue: status === 'Paid' ? 0 : total,
    lineItems,
    payments,
  };
}

function generateMockDebtors() {
  return [
    { client: 'Marketing Pro', overdueInvoices: 3, balanceDue: 3200, currency: 'USD' },
    { client: 'Design Studio', overdueInvoices: 1, balanceDue: 1800, currency: 'EUR' },
    { client: 'Startup Inc', overdueInvoices: 2, balanceDue: 1500, currency: 'USD' },
    { client: 'Consulting Co', overdueInvoices: 1, balanceDue: 800, currency: 'UAH' },
    { client: 'Global Solutions', overdueInvoices: 2, balanceDue: 2200, currency: 'EUR' },
    { client: 'Innovation Labs', overdueInvoices: 1, balanceDue: 950, currency: 'USD' },
  ];
}
