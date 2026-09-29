import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import '../styles/auth.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Barcha maydonlarni toldiring');
      return;
    }
    
    if (username === 'admin' && password === 'admin123456') {
      const user = {
        id: 'admin',
        username: 'admin',
        fullName: 'System Admin',
        email: 'admin@nova.chat',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=admin&backgroundColor=ff7597',
        isAdmin: true,
        bio: 'System Administrator'
      };
      
      login(user);
      navigate('/admin');
    } else {
      setError('Login yoki parol xato');
    }
  };

  return (
    <div className="auth-container" style={{ background: '#0f172a' }}>
      <div className="auth-card" style={{ border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div className="auth-header">
          <div className="auth-logo" style={{ color: '#ef4444' }}>
            <Shield className="inline-block ml-1 w-8 h-8 text-red-500" /> NOVA ADMIN
          </div>
          <h1 className="auth-title">Admin Panel</h1>
          <p className="auth-subtitle">Tizimni boshqarish uchun kiring</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Admin Login</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                placeholder="Loginni kiriting" 
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

          <button type="submit" className="btn-primary auth-submit" style={{ background: '#ef4444' }}>
            Panelga Kirish
          </button>
        </form>
      </div>
    </div>
  );
}
