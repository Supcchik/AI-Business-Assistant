import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Starting minimal database seeding...");
    
    try {
      // Create just 3 test clients (зменшено з 5)
      const clientIds = [];
      for (let i = 0; i < 3; i++) {
        const clientId = await ctx.db.insert("clients", {
          name: `Test Company ${i + 1}`,
          email: `company${i + 1}@test.com`,
          phone: `+1-555-${1000 + i}`,
          defaultCurrency: "USD",
          address: `${100 + i} Test Street, US`,
          industry: "Technology",
          country: "US",
          employeeCount: 50 + i * 10,
          foundedYear: 2020 + i,
          website: `https://company${i + 1}.test`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        clientIds.push(clientId);
      }
      
      console.log(`👥 Created ${clientIds.length} test clients`);
      
      // Create just 2 test products (зменшено з 3)
      const productIds = [];
      const products = [
        { name: "Web Development", unitPrice: 75, currency: "USD", category: "Development" },
        { name: "UI/UX Design", unitPrice: 60, currency: "USD", category: "Design" }
      ];
      
      for (const product of products) {
        const productId = await ctx.db.insert("products", {
          name: product.name,
          description: `Test ${product.name} service`,
          unitPrice: product.unitPrice,
          currency: product.currency,
          category: product.category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        productIds.push(productId);
      }
      
      console.log(`📦 Created ${productIds.length} test products`);
      
      // Create just 5 test invoices (зменшено з 10)
      const invoices = [];
      for (let i = 0; i < 5; i++) {
        const clientId = clientIds[i % clientIds.length];
        const productId = productIds[i % productIds.length];
        const product = products[i % products.length];
        
        const total = product.unitPrice * (i + 1);
        const status = i < 3 ? "Paid" : "Sent"; // 3 paid, 2 sent
        
        const invoiceId = await ctx.db.insert("invoices", {
          businessId: `INV-TEST-${1001 + i}`,
          clientId,
          status,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          currency: "USD",
          total,
          balanceDue: status === "Paid" ? 0 : total,
          notes: `Test invoice ${i + 1}`,
          paymentTerms: "Net 30",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        // Create one line item per invoice
        await ctx.db.insert("lineItems", {
          invoiceId,
          productId,
          description: product.name,
          qty: i + 1,
          unitPrice: product.unitPrice,
          total,
          currency: "USD",
        });
        
        // Create payment if status is Paid
        if (status === "Paid") {
          await ctx.db.insert("payments", {
            invoiceId,
            amount: total,
            currency: "USD",
            method: ["Bank Transfer", "Credit Card", "PayPal"][Math.floor(Math.random() * 3)],
            date: new Date().toISOString().split('T')[0],
            reference: `PAY-TEST-${10001 + i}`,
          });
        }
        
        invoices.push({ id: invoiceId, businessId: `INV-TEST-${1001 + i}`, total });
      }
      
      console.log(`📄 Created ${invoices.length} test invoices`);
      
      return {
        success: true,
        message: `Database seeded successfully! Created ${clientIds.length} clients, ${productIds.length} products, and ${invoices.length} invoices.`,
        summary: {
          clients: clientIds.length,
          products: productIds.length,
          invoices: invoices.length,
        }
      };
      
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      throw new Error(`Failed to seed database: ${error}`);
    }
  },
});

export const resetData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🗑️ Starting database reset...");
    
    try {
      // Delete data in small batches to avoid read limit
      let deletedCount = 0;
      
      // Delete clients (should be small number)
      const clients = await ctx.db.query("clients").collect();
      for (const client of clients) {
        await ctx.db.delete(client._id);
        deletedCount++;
      }
      console.log(`🗑️ Deleted ${clients.length} clients`);
      
      // Delete products (should be small number)
      const products = await ctx.db.query("products").collect();
      for (const product of products) {
        await ctx.db.delete(product._id);
        deletedCount++;
      }
      console.log(`🗑️ Deleted ${products.length} products`);
      
      // Delete invoices (should be small number)
      const invoices = await ctx.db.query("invoices").collect();
      for (const invoice of invoices) {
        await ctx.db.delete(invoice._id);
        deletedCount++;
      }
      console.log(`🗑️ Deleted ${invoices.length} invoices`);
      
      // Delete line items (should be small number)
      const lineItems = await ctx.db.query("lineItems").collect();
      for (const lineItem of lineItems) {
        await ctx.db.delete(lineItem._id);
        deletedCount++;
      }
      console.log(`🗑️ Deleted ${lineItems.length} line items`);
      
      // Delete payments (should be small number)
      const payments = await ctx.db.query("payments").collect();
      for (const payment of payments) {
        await ctx.db.delete(payment._id);
        deletedCount++;
      }
      console.log(`🗑️ Deleted ${payments.length} payments`);
      
      console.log("🗑️ Database reset completed");
      
      return {
        success: true,
        message: `Database reset successfully! Deleted ${deletedCount} total records.`,
        deleted: {
          total: deletedCount,
          clients: clients.length,
          products: products.length,
          invoices: invoices.length,
          lineItems: lineItems.length,
          payments: payments.length,
        }
      };
      
    } catch (error) {
      console.error("❌ Error resetting database:", error);
      throw new Error(`Failed to reset database: ${error}`);
    }
  },
});
