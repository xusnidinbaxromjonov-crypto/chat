import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { useChatStore } from './store/useChatStore';
import { socket } from './socket';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Register from './pages/Register';
import Messenger from './pages/Messenger';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  const { theme } = useAppStore();
  const { isAuthenticated, user, updateProfile } = useAuthStore();
  const { setUsers, setChats, setMessages, setAds } = useChatStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    // socket listeners removed completely as we are now fully on Supabase
    // Ads from Supabase
    const fetchAds = async () => {
      const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const formattedAds = data.map(d => ({
          id: d.id,
          ownerId: d.owner_id,
          ownerName: d.owner_name,
          ownerAvatar: d.owner_avatar,
          title: d.title,
          price: d.price,
          description: d.description,
          createdAt: d.created_at
        }));
        // We replace the entire ads array with the source of truth from DB
        useChatStore.setState({ ads: formattedAds });
      }
    };
    
    // Users from Supabase
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data) {
        const formattedUsers = data.map(d => ({
          id: d.id,
          username: d.username,
          fullName: d.full_name,
          avatar: d.avatar_url,
          isOnline: d.is_online,
          lastSeen: d.last_seen
        }));
        useChatStore.getState().setUsers(formattedUsers);
      }
    };
    
    // Chats from Supabase
    const fetchChats = async () => {
      const { data, error } = await supabase.from('chats').select('*');
      if (!error && data) {
        const formattedChats = data.map(c => ({
          id: c.id,
          isGroup: c.is_group,
          name: c.name,
          avatar: c.avatar,
          participants: c.participants,
          unreadCount: 0,
        }));
        useChatStore.getState().setChats(formattedChats);
      }
    };
    
    // Messages from Supabase
    const fetchMessages = async () => {
      const { data, error } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
      if (!error && data) {
        // Group by chatId
        const grouped = {};
        data.forEach(m => {
          if (!grouped[m.chat_id]) grouped[m.chat_id] = [];
          grouped[m.chat_id].push({
            id: m.id,
            senderId: m.sender_id,
            text: m.text,
            imageUrl: m.image_url,
            isRead: m.is_read,
            timestamp: m.timestamp
          });
        });
        useChatStore.getState().setMessages(grouped);
      }
    };

    if (isAuthenticated) {
      fetchAds();
      fetchUsers();
      fetchChats();
      fetchMessages();
    }
    
    // Supabase realtime subscription for ads
    const adsSubscription = supabase
      .channel('public:ads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ads' }, payload => {
        const newDbAd = payload.new;
        const newAd = {
          id: newDbAd.id,
          ownerId: newDbAd.owner_id,
          ownerName: newDbAd.owner_name,
          ownerAvatar: newDbAd.owner_avatar,
          title: newDbAd.title,
          price: newDbAd.price,
          description: newDbAd.description,
          createdAt: newDbAd.created_at
        };
        useChatStore.getState().addAd(newAd);
      })
      .subscribe();
      
    // Supabase realtime subscription for users
    const usersSubscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, payload => {
        fetchUsers();
      })
      .subscribe();
      
    // Supabase realtime subscription for chats
    const chatsSubscription = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, payload => {
        fetchChats();
      })
      .subscribe();
      
    // Supabase realtime subscription for messages
    const messagesSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        fetchMessages();
      })
      .subscribe();
      
    if (isAuthenticated && user) {
       // local socket emit removed
    }
    
    return () => {
      supabase.removeChannel(adsSubscription);
      supabase.removeChannel(usersSubscription);
      supabase.removeChannel(chatsSubscription);
      supabase.removeChannel(messagesSubscription);
    };
  }, [isAuthenticated, user, setUsers, setChats, setMessages]);

  useEffect(() => {
    if (isAuthenticated && user?.avatar?.includes('pravatar')) {
      updateProfile({ avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || 'S'}&backgroundColor=ff7597` });
    }
  }, [isAuthenticated, user, updateProfile]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Messenger /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/login" 
          element={!isAuthenticated || !user?.isAdmin ? <AdminLogin /> : <Navigate to="/admin" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated && user?.isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
