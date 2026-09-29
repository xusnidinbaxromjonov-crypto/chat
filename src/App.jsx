import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { useChatStore } from './store/useChatStore';
import { socket } from './socket';
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
    socket.on('sync_ads', setAds);
    
    if (isAuthenticated && user) {
       socket.emit('login', user);
    }
    
    return () => {
      socket.off('sync_users');
      socket.off('sync_chats');
      socket.off('sync_messages');
      socket.off('sync_ads');
    };
  }, [isAuthenticated, user, setUsers, setChats, setMessages, setAds]);

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
