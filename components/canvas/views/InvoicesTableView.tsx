"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useInvoices } from '@/lib/hooks';
import { useUIStore } from '@/stores/uiStore';

interface Invoice {
  _id: string;
  businessId: string;
  client: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  status: string;
  currency: string;
  total: number;
  balanceDue: number;
}

export function InvoicesTableView() {
  const [period, setPeriod] = useState(90);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibleRows, setVisibleRows] = useState<Invoice[]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  
  const { invoices, loading, error } = useInvoices(period);
  const { dataLoading, setDataLoaded } = useUIStore();

  // Поступове завантаження рядків
  useEffect(() => {
    if (dataLoading && invoices.length > 0) {
      const timer = setTimeout(() => {
        if (currentRowIndex < invoices.length) {
          setVisibleRows(prev => [...prev, invoices[currentRowIndex]]);
          setCurrentRowIndex(prev => prev + 1);
        } else {
          setDataLoaded(true);
        }
      }, 150); // Затримка 150ms між рядками
      
      return () => clearTimeout(timer);
    }
  }, [dataLoading, invoices, currentRowIndex, setDataLoaded]);

  // Скидання при зміні періоду
  useEffect(() => {
    setVisibleRows([]);
    setCurrentRowIndex(0);
  }, [period]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Sent': return 'secondary';
      case 'Overdue': return 'destructive';
      case 'Draft': return 'outline';
      case 'PartiallyPaid': return 'secondary';
      default: return 'secondary';
    }
  };

  // Filter invoices based on search and status
  const filteredInvoices = (dataLoading ? visibleRows : invoices).filter((invoice: Invoice) => {
    const matchesSearch = (invoice.client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (invoice.businessId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-9 w-32" />
          </div>

          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
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
          <p>Error loading invoices: {error}</p>
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Invoices</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant={period === 30 ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod(30)}
            >
              30 days
            </Button>
            <Button 
              variant={period === 90 ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod(90)}
            >
              90 days
            </Button>
            <Button 
              variant={period === 180 ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod(180)}
            >
              180 days
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <Input 
            placeholder="Search by client or ID..." 
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="PartiallyPaid">Partially Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredInvoices.length} invoices for the last {period} days
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Balance Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No invoices found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredInvoices.map((invoice: Invoice, index: number) => (
                  <motion.tr
                    key={invoice._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-mono">{invoice.businessId}</TableCell>
                    <TableCell className="font-medium">{invoice.client}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.currency}</TableCell>
                    <TableCell>${invoice.total.toLocaleString()}</TableCell>
                    <TableCell className={invoice.balanceDue > 0 ? "text-destructive font-medium" : ""}>
                      ${invoice.balanceDue.toLocaleString()}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
