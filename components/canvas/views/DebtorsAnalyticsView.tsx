"use client";

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebtors } from '@/lib/hooks';

interface Debtor {
  client: string;
  overdueInvoices: number;
  balanceDue: number;
  currency: string;
}

export function DebtorsAnalyticsView() {
  const { debtors, loading, error } = useDebtors(10);

  const getBalanceBadgeVariant = (amount: number) => {
    if (amount > 2000) return 'destructive';
    if (amount > 1000) return 'default';
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Chart Placeholder Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-48 w-full" />
        </Card>

        {/* Table Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-32" />
          </div>
          
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>

        {/* Summary Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p>Error loading debtors data: {error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Debtors Overview</h3>
        <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Chart visualization will be implemented later</p>
        </div>
      </Card>

      {/* Top Debtors Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Debtors by Balance Due</h3>
          <Button variant="outline" size="sm">Export Report</Button>
        </div>
        
        {debtors.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No outstanding debtors found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Overdue Invoices</TableHead>
                <TableHead>Balance Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debtors.map((debtor: Debtor, index: number) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{debtor.client}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{debtor.overdueInvoices}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBalanceBadgeVariant(debtor.balanceDue)}>
                      ${debtor.balanceDue.toLocaleString()} {debtor.currency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => console.log(`Filter invoices for ${debtor.client}`)}
                    >
                      View Invoices
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Summary Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-destructive">
              ${debtors.reduce((sum: number, d: Debtor) => sum + d.balanceDue, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Outstanding</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {debtors.reduce((sum: number, d: Debtor) => sum + d.overdueInvoices, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Overdue Invoices</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {debtors.length}
            </p>
            <p className="text-sm text-muted-foreground">Active Debtors</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
