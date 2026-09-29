const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

let users = [];
let chats = [];
let messages = {}; 
let ads = [
  {
    id: 'ad_1',
    ownerId: 'u1',
    title: 'Noutbuk sotiladi: MacBook Pro M1',
    description: 'Yaxshi holatda, 1 yil ishlatilgan. Xotira 256GB.',
    price: '$800',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ad_2',
    ownerId: 'u2',
    title: 'Frontend dasturchi qidiryapmiz',
    description: 'React va TailwindCSS bo\'yicha tajribali mutaxassis kerak. Maosh kelishuv asosida.',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('login', (user) => {
    const existing = users.find(u => u.username === user.username);
    if (!existing) {
      users.push({ ...user, isOnline: true });
    } else {
      existing.isOnline = true;
    }
    io.emit('sync_users', users);
    io.emit('sync_chats', chats);
    io.emit('sync_messages', messages);
    io.emit('sync_ads', ads);
  });

  socket.on('logout', (username) => {
    const user = users.find(u => u.username === username);
    if (user) {
      user.isOnline = false;
      io.emit('sync_users', users);
    }
  });

  socket.on('new_chat', (chat) => {
    chats.push(chat);
    io.emit('sync_chats', chats);
  });

  socket.on('new_message', ({ chatId, message, chat }) => {
    if (!messages[chatId]) messages[chatId] = [];
    messages[chatId].push(message);
    
    // Update last message in chat
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].lastMessage = message;
    } else if (chat) {
      chats.push(chat);
    }

    io.emit('sync_chats', chats);
    io.emit('sync_messages', messages);
  });

  socket.on('edit_message', ({ chatId, messageId, newText }) => {
    if (messages[chatId]) {
      const msg = messages[chatId].find(m => m.id === messageId);
      if (msg) {
        msg.text = newText;
        io.emit('sync_messages', messages);
      }
    }
  });

  socket.on('delete_message', ({ chatId, messageId }) => {
    if (messages[chatId]) {
      messages[chatId] = messages[chatId].filter(m => m.id !== messageId);
      io.emit('sync_messages', messages);
    }
  });

  socket.on('new_ad', (ad) => {
    ads.unshift(ad); // put newest first
    io.emit('sync_ads', ads);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Nova Chat Server running on http://localhost:${PORT}`);
});
