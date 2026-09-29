import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, AlertTriangle, Activity, Settings, LogOut, Shield, Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const { users, messages, chats } = useChatStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monitor');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'monitor', icon: Activity, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Foydalanuvchilar' },
  ];

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <Shield size={28} /> NOVA ADMIN
        </div>
        <div className="admin-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={20} />
                {item.label}
              </div>
            );
          })}
        </div>
        
        <div style={{ marginTop: 'auto', padding: '0 16px' }}>
          <div className="admin-nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
            <LogOut size={20} />
            Logout
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Statistika</h1>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Ilovaga qaytish
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}><Users size={28} /></div>
            <div className="stat-info">
              <h4>Jami foydalanuvchilar</h4>
              <p>{users.length + 1520}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><Activity size={28} /></div>
            <div className="stat-info">
              <h4>Hozir onlayn</h4>
              <p>{users.filter(u => u.isOnline).length + 342}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><MessageSquare size={28} /></div>
            <div className="stat-info">
              <h4>Bugungi xabarlar</h4>
              <p>42,150</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <AlertTriangle size={28} />
            </div>
            <div className="stat-info">
              <h4>Faol guruhlar</h4>
              <p>12</p>
            </div>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="users-table-container">
            <div className="users-table-header">
              <h3>Foydalanuvchilar ro'yxati</h3>
              <div className="search-container" style={{ width: '300px', padding: 0 }}>
                <Search className="search-icon" style={{ left: '10px' }} />
                <input type="text" placeholder="Qidirish..." style={{ paddingLeft: '32px' }} />
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Ism Familiya</th>
                  <th>Telefon / Email</th>
                  <th>Sana</th>
                  <th>Holat</th>
                  <th>Batafsil</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="user-cell">
                        <img src={u.avatar} alt={u.fullName} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>Sep 12, 2026</td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                    <td>
                      <button style={{ color: '#3b82f6', background: 'transparent' }}><Search size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'monitor' && (
          <div className="users-table-container">
            <div className="users-table-header">
              <h3>Jonli xabarlar oqimi</h3>
              <div className="search-container" style={{ width: '300px', padding: 0 }}>
                <Search className="search-icon" style={{ left: '10px' }} />
                <input type="text" placeholder="Xabarlardan qidirish..." style={{ paddingLeft: '32px' }} />
              </div>
            </div>
            
            {Object.keys(messages).length === 0 ? (
               <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                 Hozircha xabarlar yo'q.
               </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Yuboruvchi</th>
                    <th>Qabul qiluvchi</th>
                    <th>Vaqt</th>
                    <th>Xabar</th>
                    <th>Batafsil</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(messages).flatMap(([chatId, msgs]) => 
                    msgs.map(m => {
                      const sender = users.find(u => u.id === m.senderId);
                      const chat = chats.find(c => c.id === chatId);
                      const chatName = chat?.isGroup 
                        ? chat.name 
                        : (chat?.participants?.find(p => p !== m.senderId) || 'Noma\'lum');
                      return { ...m, chatId, senderName: sender?.fullName || m.senderId, chatName, senderAvatar: sender?.avatar };
                    })
                  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((m, i) => (
                    <tr key={m.id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="user-cell">
                          {m.senderAvatar && <img src={m.senderAvatar} alt={m.senderName} />}
                          <div style={{ fontWeight: 600 }}>{m.senderName}</div>
                        </div>
                      </td>
                      <td>{m.chatName}</td>
                      <td>{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.imageUrl ? '[Rasm yuborildi]' : m.text}
                      </td>
                      <td>
                        <button style={{ color: '#3b82f6', background: 'transparent' }}><Search size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
