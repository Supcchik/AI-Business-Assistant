"use client";

import { create } from 'zustand';

type Mode = 'empty' | 'loading' | 'dashboard';
type AgentStatus = 'idle' | 'listening' | 'thinking' | 'loading' | 'success' | 'error';
type ActiveView = 'none' | 'invoices' | 'invoiceDetails' | 'debtors' | 'wizard';

interface UIState {
  mode: Mode;
  agentStatus: AgentStatus;
  activeView: ActiveView;
  dataLoading: boolean;
  dataLoaded: boolean;
  
  // Actions
  setMode: (mode: Mode) => void;
  setStatus: (status: AgentStatus) => void;
  setView: (view: ActiveView) => void;
  setDataLoading: (loading: boolean) => void;
  setDataLoaded: (loaded: boolean) => void;
  resetScreen: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mode: 'empty',
  agentStatus: 'idle',
  activeView: 'none',
  dataLoading: false,
  dataLoaded: false,
  
  setMode: (mode) => set({ mode }),
  setStatus: (status) => set({ agentStatus: status }),
  setView: (view) => set({ activeView: view }),
  setDataLoading: (loading) => set({ dataLoading: loading }),
  setDataLoaded: (loaded) => set({ dataLoaded: loaded }),
  resetScreen: () => set({ 
    mode: 'empty', 
    agentStatus: 'idle', 
    activeView: 'none',
    dataLoading: false,
    dataLoaded: false
  }),
}));
