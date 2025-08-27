"use client";

import { ConvexProvider, convex } from '@/lib/convex';
import { TopBar } from '@/components/TopBar';
import { OrbCenterSlot } from '@/components/orb/OrbCenterSlot';
import { Canvas } from '@/components/canvas/Canvas';
import { LoadingView } from '@/components/canvas/views/LoadingView';
import { ChatDock } from '@/components/chat/ChatDock';
import { useUIStore } from '@/stores/uiStore';

export function AppShell() {
  const { mode, agentStatus } = useUIStore();
  
  // Debug logging
  console.log('AppShell render:', { mode, agentStatus });

  return (
    <ConvexProvider client={convex}>
      <div className="min-h-screen bg-background">
        <TopBar />
        
        <main className="flex-1 pb-[calc(var(--chat-dock-actual-height,var(--chat-dock-total-height))+24px)]">
          {mode === 'empty' ? (
            <OrbCenterSlot status={agentStatus} />
          ) : mode === 'loading' ? (
            <LoadingView />
          ) : (
            <Canvas />
          )}
        </main>
        
        <ChatDock />
      </div>
    </ConvexProvider>
  );
}
