import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { socket } from '../../socket';
import { supabase } from '../../lib/supabase';

export default function NewAdModal({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) return;

    const newAd = {
      id: `ad_${Date.now()}`,
      owner_id: user.id,
      owner_name: user.fullName,
      owner_avatar: user.avatar,
      title,
      created_at: new Date().toISOString()
    };
    
    // Optimsitic UI update
    useChatStore.getState().addAd({
      id: newAd.id,
      ownerId: newAd.owner_id,
      ownerName: newAd.owner_name,
      ownerAvatar: newAd.owner_avatar,
      title: newAd.title,
      createdAt: newAd.created_at
    });
    
    // Insert into Supabase
    const { error } = await supabase.from('ads').insert([newAd]);
    if (error) {
      console.error('Error creating ad:', error);
    }
    
    setTitle('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Yangi E'lon Berish"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Bekor qilish</button>
          <button className="btn-primary" onClick={handleCreate} disabled={!title.trim()}>
            E'lonni Joylash
          </button>
        </>
      }
    >
      <div className="input-group">
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Sarlavhani kiriting..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ paddingLeft: '14px' }}
          />
        </div>
      </div>
    </Modal>
  );
}
