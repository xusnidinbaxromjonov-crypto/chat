import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Iltimos barcha maydonlarni to\'ldiring');
      return;
    }
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      const fullName = data.user.user_metadata?.full_name || email.split('@')[0];

      const user = {
        id: data.user.id,
        username: fullName.toLowerCase().replace(/\s+/g, ''),
        fullName: fullName,
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}&backgroundColor=ff7597`,
        isAdmin: false,
        bio: 'Salom, men Nova chatdaman!'
      };
      
      login(user);
      navigate('/');
    } catch (err) {
      setError(err.message || "Tizimga kirishda xatolik yuz berdi");
    }
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
            <label>Email</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="email" 
                placeholder="Emailingizni kiriting" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          Akkauntingiz yo'qmi? 
          <Link to="/register" className="auth-link">Ro'yxatdan o'tish</Link>
        </div>
      </div>
    </div>
  );
}
