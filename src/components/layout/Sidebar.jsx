import { useState } from 'react';
import { Search, Plus, Settings, MessageSquare, Users, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { format } from 'date-fns';
import NewChatModal from '../modals/NewChatModal';
import SettingsModal from '../modals/SettingsModal';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuthStore();
  const { chats, activeChatId, setActiveChat, users } = useChatStore();
  const { theme, toggleTheme, isSidebarOpen, setSidebarOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getChatName = (chat) => {
    if (chat.isGroup) return chat.name;
    const otherParticipantId = chat.participants.find(p => p !== user.id);
    const otherUser = users.find(u => u.id === otherParticipantId);
    return otherUser?.fullName || 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    if (chat.isGroup) return chat.avatar;
    const otherParticipantId = chat.participants.find(p => p !== user.id);
    const otherUser = users.find(u => u.id === otherParticipantId);
    return otherUser?.avatar || '';
  };

  const isOnline = (chat) => {
    if (chat.isGroup) return false;
    const otherParticipantId = chat.participants.find(p => p !== user.id);
    const otherUser = users.find(u => u.id === otherParticipantId);
    return otherUser?.isOnline || false;
  };

  const myChats = chats.filter(chat => chat.isGroup || chat.participants.includes(user.id));

  const filteredChats = myChats.filter(chat => 
    getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`sidebar ${!isSidebarOpen ? 'hidden' : ''}`}>
      <div className="sidebar-header">
        <div className="user-profile-preview">
          <img src={user?.avatar || 'https://i.pravatar.cc/150'} alt="Profile" />
          <div className="user-info">
            <h3>{user?.fullName || 'User'}</h3>
            <p>My Account</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn-icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} />
          </button>
          <button className="btn-icon bg-accent-color text-white" style={{ backgroundColor: 'var(--accent-color)', color: 'white' }} onClick={() => setIsNewChatOpen(true)}>
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="search-container">
        <Search className="search-icon" />
        <input 
          type="text" 
          placeholder="Search chats..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="sidebar-tabs">
        <div 
          className={`sidebar-tab ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          All Chats
        </div>
        <div 
          className={`sidebar-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </div>
        <div 
          className="sidebar-tab mobile-only"
          onClick={() => {
            setActiveChat(null);
            setSidebarOpen(false);
          }}
        >
          E'lonlar
        </div>
      </div>

      <div className="chat-list scrollbar-hide">
        {filteredChats.map((chat) => (
          <div 
            key={chat.id} 
            className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
            onClick={() => {
              setActiveChat(chat.id);
              if (window.innerWidth <= 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <div className="chat-item-avatar-container">
              <img src={getChatAvatar(chat)} alt={getChatName(chat)} className="chat-item-avatar" />
              {isOnline(chat) && <div className="online-indicator"></div>}
            </div>
            
            <div className="chat-item-content">
              <div className="chat-item-header">
                <span className="chat-item-name">{getChatName(chat)}</span>
                <span className="chat-item-time">
                  {chat.lastMessage?.timestamp ? format(new Date(chat.lastMessage.timestamp), 'HH:mm') : ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="chat-item-message">
                  {chat.lastMessage?.senderId === 'currentUser' ? 'You: ' : ''}
                  {chat.lastMessage?.text || 'Started a chat'}
                </span>
                {chat.unreadCount > 0 && (
                  <span className="chat-item-badge">{chat.unreadCount}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <NewChatModal isOpen={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
