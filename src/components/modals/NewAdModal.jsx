import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuthStore } from '../../store/useAuthStore';
import { socket } from '../../socket';

export default function NewAdModal({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleCreate = () => {
    if (!title.trim() || !description.trim() || !price.trim()) return;

    const newAd = {
      id: `ad_${Date.now()}`,
      ownerId: user.id,
      title,
      description,
      price,
      createdAt: new Date().toISOString()
    };
    
    socket.emit('new_ad', newAd);
    
    setTitle('');
    setDescription('');
    setPrice('');
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
          <button className="btn-primary" onClick={handleCreate} disabled={!title.trim() || !description.trim() || !price.trim()}>
            E'lonni Joylash
          </button>
        </>
      }
    >
      <div className="input-group">
        <label>Sarlavha (Nima sotyapsiz?)</label>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Masalan: iPhone 13 Pro Max" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ paddingLeft: '14px' }}
          />
        </div>
      </div>
      <div className="input-group">
        <label>Narxi</label>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Masalan: 500$ yoki Kelishiladi" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ paddingLeft: '14px' }}
          />
        </div>
      </div>
      <div className="input-group">
        <label>Batafsil ma'lumot</label>
        <div className="input-wrapper">
          <textarea 
            placeholder="Holati, xotirasi, qayerdan olinadi..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', resize: 'none' }}
          />
        </div>
      </div>
    </Modal>
  );
}
