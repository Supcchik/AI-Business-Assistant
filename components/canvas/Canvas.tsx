import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useUIStore } from '@/stores/uiStore';
import { ViewContainer } from './ViewContainer';

export function Canvas() {
  const { mode, activeView, dataLoading } = useUIStore();

  if (mode === 'empty' || mode === 'loading') {
    return null;
  }

  return (
    <div className="flex-1 p-6 pb-0">
      <Tabs value={activeView} className="w-full">
        <TabsContent value="invoices" className="mt-6">
          <ViewContainer view="invoices" />
        </TabsContent>
        
        <TabsContent value="invoiceDetails" className="mt-6">
          <ViewContainer view="invoiceDetails" />
        </TabsContent>
        
        <TabsContent value="debtors" className="mt-6">
          <ViewContainer view="debtors" />
        </TabsContent>
        
        <TabsContent value="wizard" className="mt-6">
          <ViewContainer view="wizard" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
