import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import '../styles/auth.css';
import { mockUsers } from '../data/mockData';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    // Mock login logic
    const username = email.split('@')[0];
    const user = {
      id: username,
      username: username,
      fullName: username.charAt(0).toUpperCase() + username.slice(1),
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=ff7597`,
      isAdmin: false,
      bio: 'Ready to chat!'
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue to Nova Chat</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email or Phone</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input 
                type="text" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
