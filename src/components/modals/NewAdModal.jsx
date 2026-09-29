import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuthStore } from '../../store/useAuthStore';
import { socket } from '../../socket';

export default function NewAdModal({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;

    const newAd = {
      id: `ad_${Date.now()}`,
      ownerId: user.id,
      title,
      createdAt: new Date().toISOString()
    };
    
    socket.emit('new_ad', newAd);
    
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
