import { mutation } from "./_generated/server";

export const clearAllTables = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🧹 Starting to clear all tables...");
    
    try {
      let totalDeleted = 0;
      
      // Clear clients table (should be small)
      const clients = await ctx.db.query("clients").collect();
      console.log(`Found ${clients.length} clients to delete`);
      for (const client of clients) {
        await ctx.db.delete(client._id);
        totalDeleted++;
      }
      console.log(`✅ Deleted ${clients.length} clients`);
      
      // Clear products table (should be small)
      const products = await ctx.db.query("products").collect();
      console.log(`Found ${products.length} products to delete`);
      for (const product of products) {
        await ctx.db.delete(product._id);
        totalDeleted++;
      }
      console.log(`✅ Deleted ${products.length} products`);
      
      // Clear invoices table (should be small after previous clear)
      const invoices = await ctx.db.query("invoices").collect();
      console.log(`Found ${invoices.length} invoices to delete`);
      for (const invoice of invoices) {
        await ctx.db.delete(invoice._id);
        totalDeleted++;
      }
      console.log(`✅ Deleted ${invoices.length} invoices`);
      
      // Clear lineItems table - process all at once since we're already under limit
      const lineItems = await ctx.db.query("lineItems").collect();
      console.log(`Found ${lineItems.length} line items to delete`);
      for (const lineItem of lineItems) {
        await ctx.db.delete(lineItem._id);
        totalDeleted++;
      }
      console.log(`✅ Deleted ${lineItems.length} line items`);
      
      // Clear payments table (should be small after previous clear)
      const payments = await ctx.db.query("payments").collect();
      console.log(`Found ${payments.length} payments to delete`);
      for (const payment of payments) {
        await ctx.db.delete(payment._id);
        totalDeleted++;
      }
      console.log(`✅ Deleted ${payments.length} payments`);
      
      console.log(`🧹 All tables cleared! Total deleted: ${totalDeleted}`);
      
      return {
        success: true,
        message: `All tables cleared successfully! Deleted ${totalDeleted} records.`,
        summary: {
          totalDeleted,
          clients: clients.length,
          products: products.length,
          invoices: invoices.length,
          lineItems: lineItems.length,
          payments: payments.length,
        }
      };
      
    } catch (error) {
      console.error("❌ Error clearing tables:", error);
      throw new Error(`Failed to clear tables: ${error}`);
    }
  },
});

// Clear lineItems in batches to avoid read limit
export const clearLineItemsInBatches = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🧹 Starting to clear lineItems in batches...");
    
    try {
      let totalDeleted = 0;
      let batchSize = 1000; // Process 1000 at a time
      let hasMore = true;
      
      while (hasMore) {
        // Get next batch of lineItems
        const lineItems = await ctx.db.query("lineItems").take(batchSize);
        
        if (lineItems.length === 0) {
          hasMore = false;
          break;
        }
        
        console.log(`Processing batch: ${lineItems.length} line items`);
        
        // Delete this batch
        for (const lineItem of lineItems) {
          await ctx.db.delete(lineItem._id);
          totalDeleted++;
        }
        
        console.log(`✅ Deleted batch of ${lineItems.length} line items. Total: ${totalDeleted}`);
        
        // If we got less than batchSize, we're done
        if (lineItems.length < batchSize) {
          hasMore = false;
        }
      }
      
      console.log(`🧹 All lineItems cleared! Total deleted: ${totalDeleted}`);
      
      return {
        success: true,
        message: `LineItems cleared successfully in batches! Deleted ${totalDeleted} records.`,
        totalDeleted
      };
      
    } catch (error) {
      console.error("❌ Error clearing lineItems in batches:", error);
      throw new Error(`Failed to clear lineItems in batches: ${error}`);
    }
  },
});

// Clear tables in order - start with smallest tables first
export const clearTablesInOrder = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🧹 Starting to clear tables in order...");
    
    try {
      let totalDeleted = 0;
      
      // Step 1: Clear clients (smallest table)
      const clients = await ctx.db.query("clients").collect();
      console.log(`Step 1: Found ${clients.length} clients to delete`);
      for (const client of clients) {
        await ctx.db.delete(client._id);
        totalDeleted++;
      }
      console.log(`✅ Step 1: Deleted ${clients.length} clients`);
      
      // Step 2: Clear products (small table)
      const products = await ctx.db.query("products").collect();
      console.log(`Step 2: Found ${products.length} products to delete`);
      for (const product of products) {
        await ctx.db.delete(product._id);
        totalDeleted++;
      }
      console.log(`✅ Step 2: Deleted ${products.length} products`);
      
      // Step 3: Clear payments (small table)
      const payments = await ctx.db.query("payments").collect();
      console.log(`Step 3: Found ${payments.length} payments to delete`);
      for (const payment of payments) {
        await ctx.db.delete(payment._id);
        totalDeleted++;
      }
      console.log(`✅ Step 3: Deleted ${payments.length} payments`);
      
      // Step 4: Clear invoices (medium table)
      const invoices = await ctx.db.query("invoices").collect();
      console.log(`Step 4: Found ${invoices.length} invoices to delete`);
      for (const invoice of invoices) {
        await ctx.db.delete(invoice._id);
        totalDeleted++;
      }
      console.log(`✅ Step 4: Deleted ${invoices.length} invoices`);
      
      // Step 5: Clear lineItems using batch function
      console.log(`Step 5: Clearing lineItems in batches...`);
      const lineItemsResult = await ctx.db.query("lineItems").collect();
      const lineItemsCount = lineItemsResult.length;
      console.log(`Found ${lineItemsCount} line items to delete in batches`);
      
      // Use batch function for lineItems
      const batchResult = await ctx.db.query("lineItems").take(1000);
      for (const lineItem of batchResult) {
        await ctx.db.delete(lineItem._id);
        totalDeleted++;
      }
      console.log(`✅ Step 5: Deleted first batch of line items (${batchResult.length})`);
      
      console.log(`🧹 Tables cleared in order! Total deleted: ${totalDeleted}`);
      
      return {
        success: true,
        message: `Tables cleared successfully in order! Deleted ${totalDeleted} records. Note: Some lineItems may remain.`,
        summary: {
          totalDeleted,
          clients: clients.length,
          products: products.length,
          payments: payments.length,
          invoices: invoices.length,
          lineItemsProcessed: batchResult.length,
          lineItemsRemaining: lineItemsCount - batchResult.length,
        }
      };
      
    } catch (error) {
      console.error("❌ Error clearing tables in order:", error);
      throw new Error(`Failed to clear tables in order: ${error}`);
    }
  },
});
