"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateInvoice, useClients } from '@/lib/hooks';
import { useUIStore } from '@/stores/uiStore';

interface Client {
  _id: string;
  name: string;
  defaultCurrency: string;
}

export function CreateInvoiceWizardView() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client: '',
    terms: 'Net 30',
    description: '',
    quantity: '',
    unitPrice: '',
  });

  const { createInvoice, loading, error } = useCreateInvoice();
  const { clients, loading: clientsLoading } = useClients();
  const { setView } = useUIStore();

  const steps = [
    { id: 1, title: 'Client & Terms', description: 'Select client and payment terms' },
    { id: 2, title: 'Line Items', description: 'Add products or services' },
    { id: 3, title: 'Review', description: 'Review and create draft' },
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateDraft = async () => {
    try {
      const result = await createInvoice({
        clientId: formData.client,
        terms: formData.terms,
        description: formData.description,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
      });

      console.log('Invoice created successfully:', result);
      
      // Redirect to invoice details view
      setView('invoiceDetails');
      
      // You could also show a success toast here
    } catch (err) {
      console.error('Failed to create invoice:', err);
      // Error is already handled by the hook
    }
  };

  const isFormValid = () => {
    return formData.client && 
           formData.description && 
           formData.quantity && 
           formData.unitPrice &&
           parseFloat(formData.quantity) > 0 &&
           parseFloat(formData.unitPrice) > 0;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Create New Invoice</h2>
          <Progress value={progress} className="w-full" />
        </div>

        {error && (
          <Alert className="mb-4">
            <AlertDescription>
              Error creating invoice: {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={currentStep.toString()} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {steps.map((step) => (
              <TabsTrigger key={step.id} value={step.id.toString()} disabled>
                {step.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="1" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Select 
                  value={formData.client} 
                  onValueChange={(value) => setFormData({ ...formData, client: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsLoading ? (
                      <SelectItem value="" disabled>Loading clients...</SelectItem>
                    ) : (
                      clients.map((client: Client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.name} ({client.defaultCurrency})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="terms">Payment Terms</Label>
                <Select 
                  value={formData.terms} 
                  onValueChange={(value) => setFormData({ ...formData, terms: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" disabled>Back</Button>
              <Button onClick={handleNext} disabled={!formData.client}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="2" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Web Development, Consulting Services"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 40"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    placeholder="e.g., 75"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  />
                </div>
              </div>

              {formData.quantity && formData.unitPrice && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total: ${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!isFormValid()}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="3" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Invoice Details</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Client:</span>
                  <p className="text-muted-foreground">
                    {clients.find((c: Client) => c._id === formData.client)?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Terms:</span>
                  <p className="text-muted-foreground">{formData.terms}</p>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-muted-foreground">{formData.description}</p>
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>
                  <p className="text-muted-foreground">{formData.quantity}</p>
                </div>
                <div>
                  <span className="font-medium">Unit Price:</span>
                  <p className="text-muted-foreground">${formData.unitPrice}</p>
                </div>
                <div>
                  <span className="font-medium">Total:</span>
                  <p className="text-muted-foreground font-semibold">
                    ${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleCreateDraft} 
                disabled={!isFormValid() || loading}
                className="min-w-[120px]"
              >
                {loading ? 'Creating...' : 'Create Draft'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
