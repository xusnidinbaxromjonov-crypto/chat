import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import '../styles/auth.css';
import { mockUsers } from '../data/mockData';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Iltimos barcha maydonlarni to\'ldiring');
      return;
    }
    
    const isAdminUser = username === 'admin' && password === 'admin123456';
    
    // Mock login logic
    const user = {
      id: isAdminUser ? 'admin' : username.toLowerCase().replace(/\s+/g, ''),
      username: isAdminUser ? 'admin' : username.toLowerCase().replace(/\s+/g, ''),
      fullName: isAdminUser ? 'System Admin' : username,
      email: isAdminUser ? 'admin@nova.chat' : `${username.toLowerCase().replace(/\s+/g, '')}@nova.chat`,
      avatar: isAdminUser ? 'https://api.dicebear.com/7.x/initials/svg?seed=admin&backgroundColor=ff7597' : `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=ff7597`,
      isAdmin: isAdminUser,
      bio: isAdminUser ? 'System Administrator' : 'Salom, men Nova chatdaman!'
    };
    
    login(user);
    navigate(user.isAdmin ? '/admin' : '/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            NOVA<Sparkles className="inline-block ml-1 w-6 h-6 text-accent" />
          </div>
          <h1 className="auth-title">Xush kelibsiz</h1>
          <p className="auth-subtitle">Davom etish uchun tizimga kiring</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Ismingiz</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                placeholder="Ismingizni kiriting" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Parol</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input 
                type="password" 
                placeholder="Parolni kiriting" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit">
            Kirish
          </button>
        </form>

        <div className="auth-footer">
          Akkauntingiz yo'qmi? 
          <Link to="/register" className="auth-link">Ro'yxatdan o'tish</Link>
        </div>
      </div>
    </div>
  );
}
