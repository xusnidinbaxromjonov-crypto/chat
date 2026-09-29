import { X, Bell, UserPlus, Image, FileText, Link as LinkIcon } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import './RightPanel.css';

export default function RightPanel() {
  const { activeChatId, chats, users } = useChatStore();
  const { setRightPanelOpen } = useAppStore();
  const { user } = useAuthStore();

  const activeChat = chats.find(c => c.id === activeChatId);

  const getChatDetails = () => {
    if (!activeChat) return null;
    if (activeChat.isGroup) {
      return {
        name: activeChat.name,
        avatar: activeChat.avatar,
        status: `${activeChat.participants.length} members`,
        bio: activeChat.description || 'Welcome to the group!',
      };
    }
    const otherId = activeChat.participants.find(p => p !== user.id);
    const otherUser = users.find(u => u.id === otherId);
    return {
      name: otherUser?.fullName || 'User',
      avatar: otherUser?.avatar || '',
      status: otherUser?.isOnline ? 'Online' : 'Offline',
      bio: otherUser?.bio || 'No bio available.',
    };
  };

  const details = getChatDetails();

  if (!details) return null;

  return (
    <div className="right-panel">
      <div className="right-panel-header">
        <span>Contact Info</span>
        <button className="btn-icon" onClick={() => setRightPanelOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="profile-info">
        <img src={details.avatar} alt={details.name} className="profile-info-avatar" />
        <h2>{details.name}</h2>
        <p>{details.status}</p>

        <div className="profile-actions">
          <button className="profile-action-btn">
            <div className="profile-action-icon"><Bell size={20} /></div>
            Mute
          </button>
          <button className="profile-action-btn">
            <div className="profile-action-icon"><UserPlus size={20} /></div>
            Add
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>About</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{details.bio}</p>
      </div>

      <div className="panel-section">
        <h3>Shared Media</h3>
        <div className="media-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="media-item">
              <img src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=100&q=80&sig=${i}`} alt="Media" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
