import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockChats, mockMessages, mockUsers, mockAds } from '../data/mockData';
import { socket } from '../socket';

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: mockChats,
      messages: mockMessages,
      users: mockUsers,
      ads: mockAds,
      activeChatId: null,
      
      setActiveChat: (chatId) => set({ activeChatId: chatId }),
      setUsers: (users) => set({ users }),
      setChats: (chats) => set({ chats }),
      setMessages: (messages) => set({ messages }),
      setAds: (ads) => set({ ads }),
      addAd: (ad) => set((state) => ({ ads: [ad, ...state.ads] })),
  
  sendMessage: (chatId, text, senderId, imageUrl = null) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      senderId,
      text,
      imageUrl,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    // Optimistic UI update
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, newMessage]
        }
      };
    });
    
    socket.emit('new_message', { chatId, message: newMessage });
  },

  editMessage: (chatId, messageId, newText) => {
    socket.emit('edit_message', { chatId, messageId, newText });
  },

  deleteMessage: (chatId, messageId) => {
    socket.emit('delete_message', { chatId, messageId });
  },
  
  markAsRead: (chatId) => {
    set((state) => ({
      chats: state.chats.map(c => 
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      )
    }));
  }
}),
{
  name: 'chat-storage',
}
));
