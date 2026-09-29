import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'dark', // default to dark theme for premium feel
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      activeTab: 'chats', // chats, contacts, settings
      setActiveTab: (tab) => set({ activeTab: tab }),

      rightPanelOpen: false,
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setRightPanelOpen: (isOpen) => set({ rightPanelOpen: isOpen }),
    }),
    {
      name: 'nova-app-storage',
    }
  )
);
