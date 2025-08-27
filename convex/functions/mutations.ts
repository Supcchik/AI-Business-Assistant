import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createInvoiceWizard = mutation({
  args: {
    clientId: v.string(),
    terms: v.string(),
    description: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
  },
  handler: async (ctx, args) => {
    // Generate new invoice ID
    const businessId = `INV-${Date.now()}`;
    
    // Calculate due date based on terms
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    
    if (args.terms.includes('Net 15')) {
      dueDate.setDate(dueDate.getDate() + 15);
    } else if (args.terms.includes('Net 30')) {
      dueDate.setDate(dueDate.getDate() + 30);
    } else if (args.terms.includes('Net 60')) {
      dueDate.setDate(dueDate.getDate() + 60);
    } else {
      dueDate.setDate(dueDate.getDate() + 30); // Default to Net 30
    }

    const total = args.quantity * args.unitPrice;
    
    try {
      // Create invoice in database
      const invoiceId = await ctx.db.insert("invoices", {
        businessId,
        clientId: args.clientId,
        issueDate,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Draft',
        currency: 'USD',
        total,
        balanceDue: total,
      });

      // Create line item
      await ctx.db.insert("lineItems", {
        invoiceId,
        description: args.description,
        qty: args.quantity,
        unitPrice: args.unitPrice,
        total,
      });

      console.log('Created draft invoice:', { id: invoiceId, businessId });
      
      return { id: invoiceId, businessId };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create invoice');
    }
  },
});

// Helper function to get created invoices (for development)
export const getCreatedInvoices = mutation({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").collect();
    return invoices;
  },
});
