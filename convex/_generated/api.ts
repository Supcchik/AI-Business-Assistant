// Generated Convex API
export const api = {
  queries: {
    listInvoicesByPeriod: "queries:listInvoicesByPeriod" as const,
    getInvoiceByBusinessId: "queries:getInvoiceByBusinessId" as const,
    getTopDebtors: "queries:getTopDebtors" as const,
    listClients: "queries:listClients" as const,
    listProducts: "queries:listProducts" as const,
  },
  
  mutations: {
    createInvoiceWizard: "mutations:createInvoiceWizard" as const,
    getCreatedInvoices: "mutations:getCreatedInvoices" as const,
  },
  
  actions: {},
  
  functions: {
    seedData: "seed:seedData" as const,
    resetData: "seed:resetData" as const,
    clearAllTables: "clear:clearAllTables" as const,
    clearTablesInOrder: "clear:clearTablesInOrder" as const,
    clearLineItemsInBatches: "clear:clearLineItemsInBatches" as const,
  },
};
