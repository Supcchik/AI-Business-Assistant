import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/stores/uiStore';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function TopBar() {
  const { resetScreen } = useUIStore();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">AI Business Assistant</h1>
        <Separator orientation="vertical" className="h-6" />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetScreen}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset screen</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
