"use client";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  FileText, 
  Search, 
  BarChart3, 
  Plus
} from 'lucide-react';

interface DemoCommand {
  id: string;
  command: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

const demoCommands: DemoCommand[] = [
  // Invoices
  {
    id: 'inv-90',
    command: 'Show invoices for 90 days',
    description: 'Display all invoices from the last 90 days',
    category: 'Invoices',
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: 'inv-30',
    command: 'Show invoices for 30 days',
    description: 'Display all invoices from the last 30 days',
    category: 'Invoices',
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: 'inv-180',
    command: 'Show invoices for 180 days',
    description: 'Display all invoices from the last 180 days',
    category: 'Invoices',
    icon: <FileText className="w-4 h-4" />
  },
  
  // Invoice Details
  {
    id: 'inv-detail-1',
    command: 'Show invoice INV-001',
    description: 'Display detailed information for invoice INV-001',
    category: 'Invoice Details',
    icon: <Search className="w-4 h-4" />
  },
  {
    id: 'inv-detail-2',
    command: 'Show invoice INV-002',
    description: 'Display detailed information for invoice INV-002',
    category: 'Invoice Details',
    icon: <Search className="w-4 h-4" />
  },
  
  // Analytics
  {
    id: 'debtors',
    command: 'Show debtors analytics',
    description: 'Display debtors analysis and statistics',
    category: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: 'top-debtors',
    command: 'Show top debtors',
    description: 'Display list of top debtors by amount',
    category: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />
  },
  
  // Create
  {
    id: 'create-inv',
    command: 'Create new invoice',
    description: 'Start creating a new invoice',
    category: 'Create',
    icon: <Plus className="w-4 h-4" />
  }
];

interface HelpDialogProps {
  onCommandSelect: (command: string) => void;
}

export function HelpDialog({ onCommandSelect }: HelpDialogProps) {
  const handleCommandSelect = (command: string) => {
    onCommandSelect(command);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Invoices': return <FileText className="w-4 h-4" />;
      case 'Invoice Details': return <Search className="w-4 h-4" />;
      case 'Analytics': return <BarChart3 className="w-4 h-4" />;
      case 'Create': return <Plus className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Available Commands
        </DropdownMenuLabel>
        
        {/* Invoices */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="w-4 h-4" />
          Invoices
        </DropdownMenuLabel>
        {demoCommands.filter(cmd => cmd.category === 'Invoices').map((cmd) => (
          <DropdownMenuItem 
            key={cmd.id}
            onClick={() => handleCommandSelect(cmd.command)}
            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
          >
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded w-full text-left">
              {cmd.command}
            </code>
            <span className="text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </DropdownMenuItem>
        ))}
        
        {/* Invoice Details */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Search className="w-4 h-4" />
          Invoice Details
        </DropdownMenuLabel>
        {demoCommands.filter(cmd => cmd.category === 'Invoice Details').map((cmd) => (
          <DropdownMenuItem 
            key={cmd.id}
            onClick={() => handleCommandSelect(cmd.command)}
            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
          >
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded w-full text-left">
              {cmd.command}
            </code>
            <span className="text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </DropdownMenuItem>
        ))}
        
        {/* Analytics */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </DropdownMenuLabel>
        {demoCommands.filter(cmd => cmd.category === 'Analytics').map((cmd) => (
          <DropdownMenuItem 
            key={cmd.id}
            onClick={() => handleCommandSelect(cmd.command)}
            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
          >
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded w-full text-left">
              {cmd.command}
            </code>
            <span className="text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </DropdownMenuItem>
        ))}
        
        {/* Create */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Plus className="w-4 h-4" />
          Create
        </DropdownMenuLabel>
        {demoCommands.filter(cmd => cmd.category === 'Create').map((cmd) => (
          <DropdownMenuItem 
            key={cmd.id}
            onClick={() => handleCommandSelect(cmd.command)}
            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
          >
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded w-full text-left">
              {cmd.command}
            </code>
            <span className="text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
