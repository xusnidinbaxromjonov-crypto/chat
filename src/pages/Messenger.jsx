import { useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/chat/ChatArea';

export default function Messenger() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <ChatArea />
      </div>
    </div>
  );
}
