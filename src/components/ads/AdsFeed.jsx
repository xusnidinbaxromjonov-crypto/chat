import { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { socket } from '../../socket';
import NewAdModal from '../modals/NewAdModal';
import { MessageSquare, Plus, Tag } from 'lucide-react';
import './AdsFeed.css';

export default function AdsFeed() {
  const { ads, users, setActiveChat, chats } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const [isNewAdOpen, setIsNewAdOpen] = useState(false);

  const handleContact = (ad) => {
    if (ad.ownerId === currentUser.id) return;
    
    // Check if chat already exists
    const existingChat = chats.find(c => 
      !c.isGroup && 
      c.participants.includes(currentUser.id) && 
      c.participants.includes(ad.ownerId)
    );

    if (existingChat) {
      setActiveChat(existingChat.id);
      return;
    }

    const chatId = `c_${Date.now()}`;
    const newChat = {
        id: chatId,
        isGroup: false,
        participants: [currentUser.id, ad.ownerId]
    };
    
    socket.emit('new_chat', newChat);
    setActiveChat(chatId);
  };

  return (
    <div className="ads-feed">
      <div className="ads-header">
        <div className="ads-header-title">
          <Tag size={24} style={{ color: 'var(--accent-color)' }} />
          <h2>E'lonlar (Marketplace)</h2>
        </div>
        <button className="btn-primary" onClick={() => setIsNewAdOpen(true)}>
          <Plus size={20} style={{ marginRight: '8px' }} />
          Yangi E'lon
        </button>
      </div>

      <div className="ads-grid">
        {ads.length === 0 ? (
          <div className="empty-ads">
            <Tag size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>Hali hech qanday e'lon yo'q. Birinchi bo'lib qo'shing!</p>
          </div>
        ) : (
          ads.map((ad, i) => {
            const owner = users.find(u => u.id === ad.ownerId);
            const isMe = owner?.id === currentUser.id;
            return (
              <div key={ad.id || i} className="ad-card">
                <div className="ad-card-header">
                  <img src={owner?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=U'} alt="" className="ad-avatar" />
                  <div>
                    <h4>{owner?.fullName || 'Foydalanuvchi'}</h4>
                    <span className="ad-date">{new Date(ad.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="ad-card-body">
                  <h3 style={{ marginBottom: (!ad.description && !ad.price) ? '16px' : '8px' }}>{ad.title}</h3>
                  {ad.description && <p>{ad.description}</p>}
                  {ad.price && <div className="ad-price">{ad.price}</div>}
                </div>
                {!isMe && (
                  <div className="ad-card-footer">
                    <button className="btn-secondary" onClick={() => handleContact(ad)} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={18} />
                      Yozishish
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <NewAdModal isOpen={isNewAdOpen} onClose={() => setIsNewAdOpen(false)} />
    </div>
  );
}
