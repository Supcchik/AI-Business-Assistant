"use client";

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useUIStore } from '@/stores/uiStore';
import { OrbDockSlot } from '@/components/orb/OrbDockSlot';
import { HelpDialog } from './HelpDialog';

export function ChatDock() {
  const [input, setInput] = useState('');
  const [dockHeight, setDockHeight] = useState(0);
  const dockRef = useRef<HTMLDivElement>(null);
  const { mode, agentStatus, setMode, setStatus, setView, setDataLoading, setDataLoaded } = useUIStore();

  const handleCommandSelect = (command: string) => {
    setInput(command);
  };

  // Розрахунок висоти ChatDock та передача в батьківський компонент
  useEffect(() => {
    const updateHeight = () => {
      if (dockRef.current) {
        const height = dockRef.current.offsetHeight;
        setDockHeight(height);
        
        // Передаємо висоту через CSS змінну для використання в інших компонентах
        document.documentElement.style.setProperty('--chat-dock-actual-height', `${height}px`);
      }
    };

    updateHeight();
    
    // Відстежуємо зміни розміру
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(updateHeight);
      if (dockRef.current) {
        resizeObserver.observe(dockRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      // Fallback для браузерів без ResizeObserver
      const handleResize = () => updateHeight();
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Початок обробки запиту
    console.log('Setting status to thinking...');
    setStatus('thinking');
    
    // Затримка 2-3 секунди для режиму thinking
    console.log('Waiting 2.5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      // Виклик Gemini API для нормалізації інтенції
      console.log('Calling Gemini API for intent normalization...');
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      
      if (!res.ok) {
        throw new Error(`Intent API error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Gemini response:', data);

      if (data.intent === "none") {
        // Fallback UX: show small tips, keep mode as is
        setStatus("error");
        console.log('Intent not recognized, showing error...');
        // TODO: Add toast notification here
        return;
      }

      // Перехід до завантаження
      console.log('Setting status to loading...');
      setStatus('loading');
      setMode('loading');
      setDataLoading(true);

      // Switch to dashboard if first time
      setMode("dashboard");

      // Dispatch by intent
      switch (data.intent) {
        case "show_invoices":
          console.log('Dispatching to invoices view with params:', data.params);
          setView("invoices");
          break;
        case "open_invoice":
          console.log('Dispatching to invoice details with params:', data.params);
          setView("invoiceDetails");
          break;
        case "top_debtors":
          console.log('Dispatching to debtors view with params:', data.params);
          setView("debtors");
          break;
        case "create_invoice":
          console.log('Dispatching to create invoice wizard with params:', data.params);
          setView("wizard");
          break;
        default:
          console.log('Unknown intent, defaulting to invoices');
          setView("invoices");
      }

      // Симуляція завантаження даних
      console.log('Starting data loading simulation...');
      setTimeout(() => {
        console.log('Setting mode to dashboard and status to success...');
        setMode('dashboard');
        setDataLoading(false);
        setDataLoaded(true);
        setStatus('success');
      }, 1000);

    } catch (error) {
      console.error('Error in intent processing:', error);
      setStatus("error");
      // Fallback to old logic
      const command = input.toLowerCase();
      
      if (command.includes('invoices') && command.includes('90')) {
        setView('invoices');
      } else if (command.includes('inv-') && /\d+/.test(command)) {
        setView('invoiceDetails');
      } else if (command.includes('debtors') || command.includes('top')) {
        setView('debtors');
      } else if (command.includes('create') && command.includes('invoice')) {
        setView('wizard');
      } else {
        setView('invoices');
      }

      setMode('dashboard');
      setDataLoading(false);
      setDataLoaded(true);
      setStatus('success');
    }

    setInput('');
  };

  return (
    <div ref={dockRef} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
      <Card className="p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          {(mode === 'dashboard' || agentStatus === 'thinking' || agentStatus === 'loading') && (
            <OrbDockSlot status={agentStatus} />
          )}
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command..."
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="sm" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
          <HelpDialog onCommandSelect={handleCommandSelect} />
        </form>
      </Card>
    </div>
  );
}
