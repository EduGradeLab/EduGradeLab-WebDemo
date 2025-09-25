import { ChatChannel, ChatMessage } from './types'

export const demoChatChannels: ChatChannel[] = [
  {
    id: '1',
    name: '10-A Sınıfı',
    type: 'class',
    description: '10-A sınıfının genel sohbet kanalı',
    memberCount: 28,
    lastMessage: 'Yarınki sınav için çalışacak mıyız?',
    lastMessageTime: '2024-01-15T18:30:00Z',
    unreadCount: 3
  },
  {
    id: '2',
    name: 'Matematik 10-A',
    type: 'subject',
    description: '10-A sınıfı matematik dersleri',
    memberCount: 28,
    lastMessage: 'Ödev teslim tarihi ne zaman?',
    lastMessageTime: '2024-01-15T16:45:00Z',
    unreadCount: 1
  },
  {
    id: '3',
    name: 'Fizik Laboratuvarı',
    type: 'subject',
    description: 'Fizik deneyleri ve uygulamaları',
    memberCount: 15,
    lastMessage: 'Bugünkü deney harikaydı!',
    lastMessageTime: '2024-01-14T15:30:00Z',
    unreadCount: 0
  },
  {
    id: '4',
    name: 'Okul Genel Duyurular',
    type: 'school',
    description: 'Okul yönetiminin duyuruları',
    memberCount: 450,
    lastMessage: 'Bilim şenliği için son başvuru 1 Şubat',
    lastMessageTime: '2024-01-11T08:00:00Z',
    unreadCount: 2
  },
  {
    id: '5',
    name: 'Kimya Grubu',
    type: 'subject',
    description: 'Kimya dersi çalışma grubu',
    memberCount: 12,
    lastMessage: 'Haftaya kimya sınavı var mı?',
    lastMessageTime: '2024-01-13T14:20:00Z',
    unreadCount: 0
  },
  {
    id: '6',
    name: 'Türkçe Kompozisyon',
    type: 'subject',
    description: 'Türkçe kompozisyon çalışmaları',
    memberCount: 20,
    lastMessage: 'Birinci olduk! 🎉',
    lastMessageTime: '2024-01-10T12:15:00Z',
    unreadCount: 5
  }
]

export const demoChatMessages: Record<string, ChatMessage[]> = {
  '1': [ // 10-A Sınıfı
    {
      id: '1',
      channelId: '1',
      authorId: 'teacher1',
      authorName: 'Ahmet Yılmaz',
      authorRole: 'teacher',
      content: 'Bugünkü dersimizde trigonometri konusuna giriş yaptık. Ödevleri yarına kadar yapmayı unutmayın.',
      timestamp: '2024-01-15T09:00:00Z',
      type: 'text'
    },
    {
      id: '2',
      channelId: '1',
      authorId: 'student1',
      authorName: 'Ayşe Kaya',
      authorRole: 'student',
      content: 'Anladım hocam, teşekkürler! 🙏',
      timestamp: '2024-01-15T09:15:00Z',
      type: 'text'
    },
    {
      id: '3',
      channelId: '1',
      authorId: 'student2',
      authorName: 'Mehmet Demir',
      authorRole: 'student',
      content: 'Yarınki sınav için çalışacak mıyız birlikte?',
      timestamp: '2024-01-15T18:30:00Z',
      type: 'text'
    },
    {
      id: '4',
      channelId: '1',
      authorId: 'student3',
      authorName: 'Zeynep Arslan',
      authorRole: 'student',
      content: 'Ben varım! Saat kaçta başlayalım?',
      timestamp: '2024-01-15T18:35:00Z',
      type: 'text'
    },
    {
      id: '5',
      channelId: '1',
      authorId: 'student4',
      authorName: 'Elif Korkmaz',
      authorRole: 'student',
      content: 'Bende katılıyorum, kütüphanede buluşalım 📚',
      timestamp: '2024-01-15T18:40:00Z',
      type: 'text'
    }
  ],
  '2': [ // Matematik 10-A
    {
      id: '6',
      channelId: '2',
      authorId: 'teacher1',
      authorName: 'Ahmet Yılmaz',
      authorRole: 'teacher',
      content: 'Ödev teslim tarihi cuma günü. Lütfen zamanında teslim edin.',
      timestamp: '2024-01-15T16:00:00Z',
      type: 'text'
    },
    {
      id: '7',
      channelId: '2',
      authorId: 'student5',
      authorName: 'Can Polat',
      authorRole: 'student',
      content: 'Ödev teslim tarihi ne zaman hocam?',
      timestamp: '2024-01-15T16:45:00Z',
      type: 'text'
    },
    {
      id: '8',
      channelId: '2',
      authorId: 'teacher1',
      authorName: 'Ahmet Yılmaz',
      authorRole: 'teacher',
      content: 'Cuma günü Can, 17:00 ye kadar.',
      timestamp: '2024-01-15T16:50:00Z',
      type: 'text'
    }
  ],
  '3': [ // Fizik Laboratuvarı
    {
      id: '9',
      channelId: '3',
      authorId: 'teacher2',
      authorName: 'Fatma Öztürk',
      authorRole: 'teacher',
      content: 'Bugünkü elektrik devreleri deneyi harika geçti! Herkes katılım için teşekkürler ⚡',
      timestamp: '2024-01-14T15:00:00Z',
      type: 'text'
    },
    {
      id: '10',
      channelId: '3',
      authorId: 'student3',
      authorName: 'Zeynep Arslan',
      authorRole: 'student',
      content: 'Bugünkü deney harikaydı! Özellikle LED lambaları yakmak çok eğlencencidi 🌟',
      timestamp: '2024-01-14T15:30:00Z',
      type: 'text'
    }
  ],
  '4': [ // Okul Genel Duyurular
    {
      id: '11',
      channelId: '4',
      authorId: 'admin1',
      authorName: 'Okul Yönetimi',
      authorRole: 'admin',
      content: 'Bilim şenliği için son başvuru 1 Şubat tarihine uzatıldı. Projelerinizi bekliyoruz! 🏆',
      timestamp: '2024-01-11T08:00:00Z',
      type: 'announcement'
    }
  ],
  '5': [ // Kimya Grubu
    {
      id: '12',
      channelId: '5',
      authorId: 'student1',
      authorName: 'Ayşe Kaya',
      authorRole: 'student',
      content: 'Haftaya kimya sınavı var mı?',
      timestamp: '2024-01-13T14:20:00Z',
      type: 'text'
    },
    {
      id: '13',
      channelId: '5',
      authorId: 'teacher3',
      authorName: 'Mustafa Çelik',
      authorRole: 'teacher',
      content: 'Evet Ayşe, cuma günü mol kavramı ve kimyasal tepkimeler konularında sınavımız var.',
      timestamp: '2024-01-13T14:25:00Z',
      type: 'text'
    }
  ],
  '6': [ // Türkçe Kompozisyon
    {
      id: '14',
      channelId: '6',
      authorId: 'teacher4',
      authorName: 'Ayşe Yıldız',
      authorRole: 'teacher',
      content: 'Birinci olduk! 🎉 Herkesin emeği için teşekkürler',
      timestamp: '2024-01-10T12:00:00Z',
      type: 'text'
    },
    {
      id: '15',
      channelId: '6',
      authorId: 'student4',
      authorName: 'Elif Korkmaz',
      authorRole: 'student',
      content: 'Birlikte başardık! 🎊',
      timestamp: '2024-01-10T12:15:00Z',
      type: 'text'
    },
    {
      id: '16',
      channelId: '6',
      authorId: 'student5',
      authorName: 'Can Polat',
      authorRole: 'student',
      content: 'Gurur duyduk öğretmenim! 🙏',
      timestamp: '2024-01-10T12:20:00Z',
      type: 'text'
    }
  ]
}

export const getChatChannelsByType = (type?: 'all' | 'class' | 'subject' | 'school') => {
  if (type === 'all') return demoChatChannels
  return demoChatChannels.filter(channel => channel.type === type)
}

export const getChatChannelById = (id: string) => {
  return demoChatChannels.find(channel => channel.id === id)
}

export const getMessagesByChannelId = (channelId: string) => {
  return demoChatMessages[channelId] || []
}