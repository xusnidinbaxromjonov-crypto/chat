import { useState } from 'react';
import Modal from '../ui/Modal';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { socket } from '../../socket';

export default function NewChatModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const { sendMessage, setActiveChat, chats, users, addChat } = useChatStore();
  const { user: currentUser } = useAuthStore();

  const handleCreate = () => {
    if (!username.trim() || !message.trim()) return;

    const targetUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!targetUser) {
      alert("Foydalanuvchi topilmadi! (Mavjud usernamelardan birini kiriting)");
      return;
    }

    const chatId = `c_${Date.now()}`;
    const newChat = {
        id: chatId,
        isGroup: false,
        participants: [currentUser.id, targetUser.id],
        lastMessage: {
           id: `m_${Date.now()}`,
           senderId: currentUser.id,
           text: message,
           timestamp: new Date().toISOString(),
           isRead: false
        }
    };
    
    // Optimistic updates
    addChat(newChat);
    const state = useChatStore.getState();
    state.setMessages({
      ...state.messages,
      [chatId]: [newChat.lastMessage]
    });
    
    socket.emit('new_message', { chatId, message: newChat.lastMessage, chat: newChat });
    setActiveChat(chatId);
    
    setUsername('');
    setMessage('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Start New Chat"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate} disabled={!username.trim() || !message.trim()}>
            Start Chat
          </button>
        </>
      }
    >
      <div className="input-group">
        <label>Username</label>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Enter friend's username..." 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ paddingLeft: '14px' }}
          />
        </div>
      </div>
      <div className="input-group">
        <label>First Message</label>
        <div className="input-wrapper">
          <textarea 
            placeholder="Say hi..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'none' }}
          />
        </div>
      </div>
    </Modal>
  );
}
