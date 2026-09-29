import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockChats, mockMessages, mockUsers, mockAds } from '../data/mockData';
import { socket } from '../socket';
import { supabase } from '../lib/supabase';

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: mockChats,
      messages: mockMessages,
      users: mockUsers,
      ads: mockAds,
      activeChatId: null,
      
      setActiveChat: (chatId) => set({ activeChatId: chatId }),
      setUsers: (incomingUsers) => set((state) => {
        const merged = [...state.users];
        incomingUsers.forEach(iu => {
          const idx = merged.findIndex(u => u.id === iu.id);
          if (idx >= 0) merged[idx] = iu;
          else merged.push(iu);
        });
        return { users: merged };
      }),
      setChats: (incomingChats) => set((state) => {
        const merged = [...state.chats];
        incomingChats.forEach(ic => {
          const idx = merged.findIndex(c => c.id === ic.id);
          if (idx >= 0) merged[idx] = ic;
          else merged.push(ic);
        });
        return { chats: merged };
      }),
      setMessages: (incomingMessages) => set((state) => {
        // incomingMessages is an object keyed by chatId
        const merged = { ...state.messages };
        Object.keys(incomingMessages).forEach(chatId => {
          const msgs = incomingMessages[chatId];
          if (!merged[chatId]) {
            merged[chatId] = msgs;
          } else {
            // merge messages for this chat
            const mergedMsgs = [...merged[chatId]];
            msgs.forEach(m => {
              const idx = mergedMsgs.findIndex(msg => msg.id === m.id);
              if (idx >= 0) mergedMsgs[idx] = m;
              else mergedMsgs.push(m);
            });
            merged[chatId] = mergedMsgs;
          }
        });
        return { messages: merged };
      }),
      setAds: (incomingAds) => set((state) => {
        const merged = [...state.ads];
        incomingAds.forEach(ia => {
          const idx = merged.findIndex(a => a.id === ia.id);
          if (idx >= 0) merged[idx] = ia;
          else merged.push(ia);
        });
        return { ads: merged };
      }),
      addAd: (ad) => set((state) => {
        if (state.ads.some(a => a.id === ad.id)) return state;
        return { ads: [ad, ...state.ads] };
      }),
      addChat: (chat) => set((state) => {
        if (state.chats.some(c => c.id === chat.id)) return state;
        return { chats: [chat, ...state.chats] };
      }),
  
  sendMessage: async (chatId, text, senderId, imageUrl = null) => {
    const dbMessage = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      chat_id: chatId,
      sender_id: senderId,
      text,
      image_url: imageUrl,
      timestamp: new Date().toISOString(),
      is_read: false,
    };
    
    // Optimistic UI update
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, {
            id: dbMessage.id,
            senderId: dbMessage.sender_id,
            text: dbMessage.text,
            imageUrl: dbMessage.image_url,
            timestamp: dbMessage.timestamp,
            isRead: dbMessage.is_read
          }]
        }
      };
    });
    
    await supabase.from('messages').insert([dbMessage]);
  },

  editMessage: async (chatId, messageId, newText) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: chatMessages.map(m => m.id === messageId ? { ...m, text: newText } : m)
        }
      };
    });
    await supabase.from('messages').update({ text: newText }).eq('id', messageId);
  },

  deleteMessage: async (chatId, messageId) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: chatMessages.filter(m => m.id !== messageId)
        }
      };
    });
    await supabase.from('messages').delete().eq('id', messageId);
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
