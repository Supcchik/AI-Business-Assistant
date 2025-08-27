"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

// TODO: Fix TypeScript errors
export default function AdminDevPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [seedStatus, setSeedStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dataSummary, setDataSummary] = useState<Record<string, unknown> | null>(null);

  // TODO: Fix Convex types
  // const seedDataMutation = useMutation(api.functions.seedData);
  // const resetDataMutation = useMutation(api.functions.resetData);
  // const clearAllTablesMutation = useMutation(api.functions.clearAllTables);
  // const clearTablesInOrderMutation = useMutation(api.functions.clearTablesInOrder);
  // const clearLineItemsInBatchesMutation = useMutation(api.functions.clearLineItemsInBatches);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const logEntry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs(prev => [logEntry, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedStatus('idle');
    addLog('🌱 Starting database seeding...', 'info');

    try {
      // TODO: Fix Convex types
      // const result = await seedDataMutation();
      // addLog(`✅ ${result.message}`, 'success');
      // setSeedStatus('success');
      // setDataSummary(result.summary);
      addLog('✅ Data seeding completed (mock)', 'success');
      setSeedStatus('success');
      setDataSummary({ message: 'Mock data seeded' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`❌ Failed to seed data: ${errorMessage}`, 'error');
      setSeedStatus('error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    addLog('🗑️ Starting database reset...', 'info');

    try {
      // TODO: Fix Convex types
      // const result = await resetDataMutation();
      // addLog(`✅ ${result.message}`, 'success');
      addLog('✅ Data reset completed (mock)', 'success');
      setSeedStatus('idle');
      setDataSummary(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`❌ Failed to reset data: ${errorMessage}`, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearAllTables = async () => {
    setIsResetting(true);
    addLog('🧹 Starting to clear all tables...', 'info');

    try {
      // TODO: Fix Convex types
      // const result = await clearAllTablesMutation();
      // addLog(`✅ ${result.message}`, 'success');
      addLog('✅ All tables cleared (mock)', 'success');
      setSeedStatus('idle');
      setDataSummary(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`❌ Failed to clear tables: ${errorMessage}`, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearTablesInOrder = async () => {
    setIsResetting(true);
    addLog('🔧 Starting to clear tables in order...', 'info');

    try {
      // TODO: Fix Convex types
      // const result = await clearTablesInOrderMutation();
      // addLog(`✅ ${result.message}`, 'success');
      addLog('✅ Tables cleared in order (mock)', 'success');
      setSeedStatus('idle');
      setDataSummary(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`❌ Failed to clear tables in order: ${errorMessage}`, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearLineItemsInBatches = async () => {
    setIsResetting(true);
    addLog('📦 Starting to clear lineItems in batches...', 'info');

    try {
      // TODO: Fix Convex types
      // const result = await clearLineItemsInBatchesMutation();
      // addLog(`✅ ${result.message}`, 'success');
      addLog('✅ Line items cleared in batches (mock)', 'success');
      setSeedStatus('idle');
      setDataSummary(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`❌ Failed to clear lineItems in batches: ${errorMessage}`, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    addLog('🚀 Admin panel loaded', 'info');
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Development Panel</h1>
          <p className="text-muted-foreground">
            Manage database and development tools
          </p>
        </div>
        <Badge variant={seedStatus === 'success' ? 'default' : seedStatus === 'error' ? 'destructive' : 'secondary'}>
          Status: {seedStatus === 'idle' ? 'Ready' : seedStatus === 'success' ? 'Seeded' : 'Error'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Database Actions</CardTitle>
            <CardDescription>
              Seed, reset, or clear the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button 
                onClick={handleSeedData} 
                disabled={isSeeding || isResetting}
                className="flex-1"
              >
                {isSeeding ? '🌱 Seeding...' : '🌱 Seed Database'}
              </Button>
              <Button 
                onClick={handleResetData} 
                disabled={isSeeding || isResetting}
                variant="destructive"
                className="flex-1"
              >
                {isResetting ? '🗑️ Resetting...' : '🗑️ Reset Database'}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleClearAllTables} 
                disabled={isSeeding || isResetting}
                variant="outline"
                className="flex-1"
              >
                {isResetting ? '🧹 Clearing...' : '🧹 Clear All Tables'}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleClearTablesInOrder} 
                disabled={isSeeding || isResetting}
                variant="outline"
                className="flex-1"
              >
                {isResetting ? '🔧 Clearing...' : '🔧 Clear Tables in Order'}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleClearLineItemsInBatches} 
                disabled={isSeeding || isResetting}
                variant="outline"
                className="flex-1"
              >
                {isResetting ? '📦 Clearing...' : '📦 Clear Line Items in Batches'}
              </Button>
            </div>
            
            {dataSummary && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Data Summary:</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>👥 Clients: {String((dataSummary as Record<string, unknown>)?.clients || 'N/A')}</div>
                  <div>📦 Products: {String((dataSummary as Record<string, unknown>)?.products || 'N/A')}</div>
                  <div>📄 Invoices: {String((dataSummary as Record<string, unknown>)?.invoices || 'N/A')}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Current system status and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Environment:</span>
                <Badge variant="outline">Development</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Database:</span>
                <Badge variant="outline">Convex</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={seedStatus === 'success' ? 'default' : 'secondary'}>
                  {seedStatus === 'success' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Logs</CardTitle>
              <CardDescription>
                Real-time database operation logs
              </CardDescription>
            </div>
            <Button onClick={clearLogs} variant="outline" size="sm">
               Clear Logs
             </Button>
        </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto space-y-2 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No logs yet. Start an operation to see live logs.
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-muted-foreground text-xs w-20 flex-shrink-0">
                    {log.timestamp}
                  </span>
                  <span className={`flex-1 ${
                    log.type === 'error' ? 'text-red-500' :
                    log.type === 'success' ? 'text-green-500' :
                    'text-foreground'
                  }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>

  {/* Instructions */}
  <Card>
    <CardHeader>
      <CardTitle>How to Use</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <h4 className="font-semibold">📦 Clear Line Items in Batches (For Large Datasets)</h4>
        <p className="text-sm text-muted-foreground">
          Clears lineItems table in small batches to avoid Convex read limits. Use this if other methods fail.
        </p>
      </div>
      <Separator />
      <div className="space-y-2">
        <h4 className="font-semibold">🔧 Clear Tables in Order (Recommended)</h4>
        <p className="text-sm text-muted-foreground">
          Clears tables step by step, starting with smallest ones. May leave some lineItems.
        </p>
      </div>
      <Separator />
      <div className="space-y-2">
        <h4 className="font-semibold">🧹 Clear All Tables</h4>
        <p className="text-sm text-muted-foreground">
          Attempts to clear all tables at once. May fail with large datasets.
        </p>
      </div>
      <Separator />
      <div className="space-y-2">
        <h4 className="font-semibold">🌱 Seed Database</h4>
        <p className="text-sm text-muted-foreground">
          Creates minimal test data: 3 clients, 2 products, 5 invoices.
        </p>
      </div>
    </CardContent>
  </Card>
</div>
);
}
