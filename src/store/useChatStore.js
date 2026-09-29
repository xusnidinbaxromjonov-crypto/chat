import { create } from 'zustand';
import { mockChats, mockMessages, mockUsers } from '../data/mockData';
import { socket } from '../socket';

export const useChatStore = create((set, get) => ({
  chats: [],
  messages: {},
  users: [],
  ads: [],
  activeChatId: null,
  
  setActiveChat: (chatId) => set({ activeChatId: chatId }),
  setUsers: (users) => set({ users }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setAds: (ads) => set({ ads }),
  
  sendMessage: (chatId, text, senderId, imageUrl = null) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      senderId,
      text,
      imageUrl,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    socket.emit('new_message', { chatId, message: newMessage });
  },
  
  markAsRead: (chatId) => {
    set((state) => ({
      chats: state.chats.map(c => 
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      )
    }));
  }
}));
