export const mockUsers = [
  {
    id: 'u1',
    username: 'aziz_dev',
    fullName: 'Azizbek',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Azizbek&backgroundColor=0284c7',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    bio: 'React Developer. Code & Coffee ☕️',
  },
  {
    id: 'u2',
    username: 'alisher_99',
    fullName: 'Alisher',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alisher&backgroundColor=0ea5e9',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    bio: 'Design is thinking made visual.',
  },
  {
    id: 'u3',
    username: 'jasur_bek',
    fullName: 'Jasurbek',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jasurbek&backgroundColor=047857',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    bio: 'Student at INHA University',
  },
  {
    id: 'u4',
    username: 'bekzod',
    fullName: 'Bekzod',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Bekzod&backgroundColor=8b5cf6',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    bio: 'SMM & Marketing 📱',
  },
];

export const mockChats = [
  {
    id: 'c1',
    isGroup: false,
    participants: ['u1', 'currentUser'],
    lastMessage: {
      id: 'm1',
      senderId: 'u1',
      text: 'Salom, loyiha qanday ketyapti?',
      timestamp: new Date(Date.now() - 500000).toISOString(),
      isRead: false,
    },
    unreadCount: 1,
    isPinned: true,
  },
  {
    id: 'c2',
    isGroup: false,
    participants: ['u2', 'currentUser'],
    lastMessage: {
      id: 'm2',
      senderId: 'currentUser',
      text: 'Xo\'p, ertaga gaplashamiz!',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // yesterday
      isRead: true,
    },
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'c3',
    isGroup: true,
    name: 'Frontend Developers 🚀',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FD&backgroundColor=f59e0b',
    participants: ['u1', 'u3', 'currentUser'],
    lastMessage: {
      id: 'm3',
      senderId: 'u3',
      text: 'Yangi React hooklarini ko\'rdinglarmi?',
      timestamp: new Date(Date.now() - 200000).toISOString(),
      isRead: false,
    },
    unreadCount: 3,
    isPinned: false,
  },
];

export const mockMessages = {
  'c1': [
    {
      id: 'm1_1',
      senderId: 'u1',
      text: 'Salom!',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
    },
    {
      id: 'm1_2',
      senderId: 'currentUser',
      text: 'Salom Azizbek! Yaxshimisiz?',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      isRead: true,
    },
    {
      id: 'm1',
      senderId: 'u1',
      text: 'Salom, loyiha qanday ketyapti?',
      timestamp: new Date(Date.now() - 500000).toISOString(),
      isRead: false,
    },
  ],
  'c2': [
    {
      id: 'm2_1',
      senderId: 'u2',
      text: 'Dizayn qismini tugatdim, kiritib ko\'rasizmi?',
      timestamp: new Date(Date.now() - 90000000).toISOString(),
      isRead: true,
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      text: 'Xo\'p, ertaga gaplashamiz!',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
  ],
  'c3': [
    {
      id: 'm3_1',
      senderId: 'u1',
      text: 'Hammaga salom!',
      timestamp: new Date(Date.now() - 5000000).toISOString(),
      isRead: true,
    },
    {
      id: 'm3',
      senderId: 'u3',
      text: 'Yangi React hooklarini ko\'rdinglarmi?',
      timestamp: new Date(Date.now() - 200000).toISOString(),
      isRead: false,
    },
  ]
};

export const mockAds = [];
