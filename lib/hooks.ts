"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

// Types for the hooks
interface CreateInvoiceData {
  clientId: string;
  terms: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CreateInvoiceResult {
  id: string;
  businessId: string;
}

// Hook for invoices list - використовуємо реальну Convex функцію
export function useInvoices(periodDays: number = 90) {
  // @ts-expect-error - Convex API types not properly generated
  const invoices = useQuery(api.queries.listInvoicesByPeriod, { periodDays });
  
  if (invoices === undefined) {
    return { invoices: [], loading: true, error: null };
  }
  
  return { 
    invoices: invoices || [], 
    loading: false, 
    error: null 
  };
}

// Hook for single invoice - використовуємо реальну Convex функцію
export function useInvoice(businessId: string | null) {
  // @ts-ignore - Convex API types not properly generated
  const invoice = useQuery(
    // @ts-ignore - Convex API types not properly generated
    api.queries.getInvoiceByBusinessId, 
    businessId ? { businessId } : "skip"
  );
  
  if (invoice === undefined) {
    return { invoice: null, loading: true, error: null };
  }
  
  return { 
    invoice: invoice || null, 
    loading: false, 
    error: null 
  };
}

// Hook for debtors - використовуємо реальну Convex функцію
export function useDebtors(limit: number = 10) {
  // @ts-expect-error - Convex API types not properly generated
  const debtors = useQuery(api.queries.getTopDebtors, { limit });
  
  if (debtors === undefined) {
    return { debtors: [], loading: true, error: null };
  }
  
  return { 
    debtors: debtors || [], 
    loading: false, 
    error: null 
  };
}

// Hook for creating invoice - використовуємо реальну Convex функцію
export function useCreateInvoice() {
  // @ts-expect-error - Convex API types not properly generated
  const createInvoiceMutation = useMutation(api.mutations.createInvoiceWizard);
  
  const createInvoice = async (data: CreateInvoiceData): Promise<CreateInvoiceResult> => {
    try {
      const result = await createInvoiceMutation(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      throw new Error(errorMessage);
    }
  };
  
  return { createInvoice, loading: false, error: null };
}

// Hook for clients list - використовуємо реальну Convex функцію
export function useClients() {
  // @ts-expect-error - Convex API types not properly generated
  const clients = useQuery(api.queries.listClients);
  
  if (clients === undefined) {
    return { clients: [], loading: true, error: null };
  }
  
  return { 
    clients: clients || [], 
    loading: false, 
    error: null 
  };
}

// Hook for products list - використовуємо реальну Convex функцію
export function useProducts() {
  // @ts-expect-error - Convex API types not properly generated
  const products = useQuery(api.queries.listProducts);
  
  if (products === undefined) {
    return { products: [], loading: true, error: null };
  }
  
  return { 
    products: products || [], 
    loading: false, 
    error: null 
  };
}
