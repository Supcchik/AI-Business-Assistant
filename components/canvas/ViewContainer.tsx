"use client";

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { InvoicesTableView } from './views/InvoicesTableView';
import { InvoiceDetailsView } from './views/InvoiceDetailsView';
import { DebtorsAnalyticsView } from './views/DebtorsAnalyticsView';
import { CreateInvoiceWizardView } from './views/CreateInvoiceWizardView';


interface ViewContainerProps {
  view: 'invoices' | 'invoiceDetails' | 'debtors' | 'wizard';
}

export function ViewContainer({ view }: ViewContainerProps) {
  // Show loading skeleton when switching views
  const isLoading = false; // Will be controlled by individual view hooks

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  switch (view) {
    case 'invoices':
      return <InvoicesTableView />;
    case 'invoiceDetails':
      return <InvoiceDetailsView />;
    case 'debtors':
      return <DebtorsAnalyticsView />;
    case 'wizard':
      return <CreateInvoiceWizardView />;
    default:
      return (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Select a view to get started</p>
        </Card>
      );
  }
}
