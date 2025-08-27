import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function InvoiceDetailsView() {
  // Mock data for now
  const invoice = {
    id: 'INV-1047',
    client: 'TechCorp Ltd',
    contact: 'john.doe@techcorp.com',
    status: 'Paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    currency: 'USD',
    total: 2500,
    balanceDue: 0,
    lineItems: [
      { description: 'Web Development', qty: 40, unitPrice: 50, total: 2000 },
      { description: 'UI/UX Design', qty: 20, unitPrice: 25, total: 500 },
    ],
    payments: [
      { date: '2024-02-10', method: 'Bank Transfer', amount: 2500, currency: 'USD' },
    ]
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Sent': return 'secondary';
      case 'Overdue': return 'destructive';
      case 'Draft': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">{invoice.id}</h2>
            <p className="text-muted-foreground">{invoice.client}</p>
          </div>
          <div className="text-right">
            <Badge variant={getStatusBadgeVariant(invoice.status)} className="mb-2">
              {invoice.status}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Issue: {invoice.issueDate} | Due: {invoice.dueDate}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Total:</span> ${invoice.total.toLocaleString()} {invoice.currency}
            </p>
            <p className="text-sm">
              <span className="font-medium">Balance Due:</span> ${invoice.balanceDue.toLocaleString()} {invoice.currency}
            </p>
          </div>
          <Badge variant="outline">
            Sent to: {invoice.contact}
          </Badge>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Line Items</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lineItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>${item.unitPrice}</TableCell>
                <TableCell>${item.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Payments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Payments</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Add Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground">Payment form will be implemented later</p>
            </DialogContent>
          </Dialog>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.payments.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
