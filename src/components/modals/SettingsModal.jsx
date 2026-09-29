import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const { theme, setTheme } = useAppStore();
  const { user, updateProfile, logout } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = () => {
    updateProfile({ fullName, bio });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Settings"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </>
      }
    >
      <div className="input-group">
        <label>Theme Preference</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn-secondary ${theme === 'light' ? 'bg-accent-color text-white' : ''}`}
            onClick={() => setTheme('light')}
            style={theme === 'light' ? { background: 'var(--accent-color)', color: 'white' } : {}}
          >
            <Sun size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Light
          </button>
          <button 
            className={`btn-secondary ${theme === 'dark' ? 'bg-accent-color text-white' : ''}`}
            onClick={() => setTheme('dark')}
            style={theme === 'dark' ? { background: 'var(--accent-color)', color: 'white' } : {}}
          >
            <Moon size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Dark
          </button>
        </div>
      </div>

      <div className="input-group">
        <label>Full Name</label>
        <div className="input-wrapper">
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ paddingLeft: '14px' }}
          />
        </div>
      </div>

      <div className="input-group">
        <label>Bio</label>
        <div className="input-wrapper">
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'none' }}
          />
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <button 
          className="btn-secondary" 
          onClick={logout} 
          style={{ width: '100%', color: '#ef4444', border: '1px solid #ef4444' }}
        >
          Log Out
        </button>
      </div>
    </Modal>
  );
}
