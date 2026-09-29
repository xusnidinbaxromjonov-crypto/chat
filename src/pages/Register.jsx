import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import '../styles/auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Iltimos barcha maydonlarni to\'ldiring');
      return;
    }
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.username,
          }
        }
      });

      if (authError) throw authError;

      const user = {
        id: data.user.id,
        username: formData.username.toLowerCase().replace(/\s+/g, ''),
        fullName: formData.username,
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.username}&backgroundColor=ff7597`,
        isAdmin: false,
        bio: 'Salom, men Nova chatdaman!'
      };
      
      login(user);
      navigate('/');
    } catch (err) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            NOVA<Sparkles className="inline-block ml-1 w-6 h-6 text-accent" />
          </div>
          <h1 className="auth-title">Ro'yxatdan O'tish</h1>
          <p className="auth-subtitle">Nova Chatga xush kelibsiz</p>
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
                name="username"
                placeholder="Ismingizni kiriting" 
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input 
                type="email" 
                name="email"
                placeholder="Emailingizni kiriting" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Parol</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input 
                type="password" 
                name="password"
                placeholder="Parol yarating" 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit">
            Ro'yxatdan O'tish
          </button>
        </form>

        <div className="auth-footer">
          Allaqachon akkauntingiz bormi? 
          <Link to="/login" className="auth-link">Kirish</Link>
        </div>
      </div>
    </div>
  );
}
