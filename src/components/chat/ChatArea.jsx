import { useState, useRef, useEffect } from 'react';
import { Search, Paperclip, Smile, Send, Check, CheckCheck, MessageSquare, Image, Edit2, Trash2, X, ArrowLeft } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { format } from 'date-fns';
import AdsFeed from '../ads/AdsFeed';
import './ChatArea.css';

export default function ChatArea() {
  const { activeChatId, chats, messages, users, sendMessage, markAsRead, editMessage, deleteMessage } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const chatMessages = messages[activeChatId] || [];

  const getChatName = () => {
    if (!activeChat) return '';
    if (activeChat.isGroup) return activeChat.name;
    const otherId = activeChat.participants.find(p => p !== currentUser.id);
    return users.find(u => u.id === otherId)?.fullName || 'User';
  };

  const getChatAvatar = () => {
    if (!activeChat) return '';
    if (activeChat.isGroup) return activeChat.avatar;
    const otherId = activeChat.participants.find(p => p !== currentUser.id);
    return users.find(u => u.id === otherId)?.avatar || '';
  };

  const isOnline = () => {
    if (!activeChat || activeChat.isGroup) return false;
    const otherId = activeChat.participants.find(p => p !== currentUser.id);
    return users.find(u => u.id === otherId)?.isOnline || false;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (activeChatId) {
      markAsRead(activeChatId);
    }
  }, [activeChatId, chatMessages.length]);

  const handleSend = () => {
    if (inputText.trim() && activeChatId) {
      if (editingMessageId) {
        editMessage(activeChatId, editingMessageId, inputText.trim());
        setEditingMessageId(null);
      } else {
        sendMessage(activeChatId, inputText.trim(), currentUser.id);
      }
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeChatId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        sendMessage(activeChatId, '', currentUser.id, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!activeChatId || !activeChat) {
    return <AdsFeed />;
  }

  return (
    <div className="chat-area">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <button 
            className="btn-icon mobile-only" 
            onClick={() => {
              useAppStore.getState().setSidebarOpen(true);
              useChatStore.getState().setActiveChat(null);
            }} 
            style={{ marginRight: '12px', marginLeft: '-8px' }}
          >
            <ArrowLeft size={20} />
          </button>
          <img src={getChatAvatar()} alt={getChatName()} className="chat-header-avatar" />
          <div className="chat-header-text">
            <h2>{getChatName()}</h2>
            <p className={`chat-header-status ${isOnline() ? 'online' : 'offline'}`}>
              {activeChat.isGroup ? `${activeChat.participants.length} members` : (isOnline() ? 'Online' : 'Last seen recently')}
            </p>
          </div>
        </div>
        
        <div className="chat-header-actions">
          {/* Actions can be added here */}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container scrollbar-hide">
        <div className="date-separator">
          <span className="date-separator-text">Today</span>
        </div>
        
        {chatMessages.map((msg, index) => {
          const isSent = msg.senderId === currentUser.id;
          return (
            <div key={msg.id || index} className={`message-wrapper ${isSent ? 'sent' : 'received'}`}>
              <div className="message-bubble">
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Sent file" className="message-image" onClick={() => setFullscreenImage(msg.imageUrl)} style={{ cursor: 'pointer' }} />
                )}
                {msg.text && <div>{msg.text}</div>}
                <div className="message-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="message-time">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                  {isSent && (
                    <>
                      {msg.text && (
                        <span style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => { setEditingMessageId(msg.id); setInputText(msg.text); }}>
                          <Edit2 size={12} />
                        </span>
                      )}
                      <span style={{ cursor: 'pointer', opacity: 0.7, color: '#ef4444' }} onClick={() => deleteMessage(activeChatId, msg.id)}>
                        <Trash2 size={12} />
                      </span>
                      <span className="message-status">
                        {msg.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <button className="btn-icon" onClick={() => fileInputRef.current?.click()}>
          <Paperclip size={22} />
        </button>
        
        <div className="chat-input-container" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {editingMessageId && (
            <button className="btn-icon" onClick={() => { setEditingMessageId(null); setInputText(''); }} style={{ marginRight: '8px', color: '#ef4444' }}>
              <X size={20} />
            </button>
          )}
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Write a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <button 
          className="send-button" 
          onClick={handleSend}
          disabled={!inputText.trim()}
          style={{ 
            opacity: inputText.trim() ? 1 : 0.5,
            cursor: inputText.trim() ? 'pointer' : 'default'
          }}
        >
          <Send size={20} className="ml-1" style={{ marginLeft: '2px' }} />
        </button>
      </div>

      {fullscreenImage && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}
          onClick={() => setFullscreenImage(null)}
        >
          <img src={fullscreenImage} alt="Fullscreen" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
}
