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
    socket.on('sync_users', setUsers);
    socket.on('sync_chats', setChats);
    socket.on('sync_messages', setMessages);
    
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
    
    if (isAuthenticated) {
      fetchAds();
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
      
    if (isAuthenticated && user) {
       socket.emit('login', user);
    }
    
    return () => {
      socket.off('sync_users');
      socket.off('sync_chats');
      socket.off('sync_messages');
      supabase.removeChannel(adsSubscription);
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
