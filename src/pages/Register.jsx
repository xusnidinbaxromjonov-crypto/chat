import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Mock registration login logic
    const user = {
      id: formData.username,
      username: formData.username,
      fullName: formData.username,
      email: formData.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.username}&backgroundColor=ff7597`,
      isAdmin: false,
      bio: 'New to Nova Chat!'
    };
    
    login(user);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            NOVA<Sparkles className="inline-block ml-1 w-6 h-6 text-accent" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Nova Chat today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                name="username"
                placeholder="Choose a username" 
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
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input 
                type="password" 
                name="password"
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
