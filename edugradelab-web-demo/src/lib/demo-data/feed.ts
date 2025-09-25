import { FeedPost } from './types'

export const demoFeedPosts: FeedPost[] = [
  {
    id: '1',
    content: 'Matematik sınavı sonuçları açıklandı! Genel ortalama 85. Harika çalışmalar için tebrikler 🎉',
    authorId: 'teacher1',
    authorName: 'Ahmet Yılmaz',
    authorRole: 'teacher',
    type: 'announcement',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 24,
    comments: [
      {
        id: '1',
        postId: '1',
        authorId: 'student1',
        authorName: 'Ayşe Kaya',
        authorRole: 'student',
        content: 'Çok teşekkür ederim hocam! 🙏',
        timestamp: '2024-01-15T11:00:00Z',
        likes: 5
      },
      {
        id: '2',
        postId: '1',
        authorId: 'student2',
        authorName: 'Mehmet Demir',
        authorRole: 'student',
        content: 'Harika bir sınavdı, teşekkürler!',
        timestamp: '2024-01-15T11:15:00Z',
        likes: 3
      }
    ],
    tags: ['matematik', 'sınav', 'sonuçlar']
  },
  {
    id: '2',
    content: 'Bugün fizik laboratuvarında yaptığımız deney çok eğlencencidi! Elektrik devreleri konusunda pratik yapmış olduk ⚡',
    authorId: 'student3',
    authorName: 'Zeynep Arslan',
    authorRole: 'student',
    type: 'achievement',
    timestamp: '2024-01-14T15:45:00Z',
    likes: 18,
    comments: [
      {
        id: '3',
        postId: '2',
        authorId: 'teacher2',
        authorName: 'Fatma Öztürk',
        authorRole: 'teacher',
        content: 'Harika bir gözlem Zeynep! Devam et 🌟',
        timestamp: '2024-01-14T16:00:00Z',
        likes: 8
      }
    ],
    tags: ['fizik', 'laboratuvar', 'başarı']
  },
  {
    id: '3',
    content: 'Haftaya cuma günü kimya sınavımız olacak. Konular: Mol kavramı ve kimyasal tepkimeler. Lütfen hazırlıklı gelin 📚',
    authorId: 'teacher3',
    authorName: 'Mustafa Çelik',
    authorRole: 'teacher',
    type: 'reminder',
    timestamp: '2024-01-13T09:00:00Z',
    likes: 12,
    comments: [],
    tags: ['kimya', 'sınav', 'hatırlatma']
  },
  {
    id: '4',
    content: '100 üzerinden 100 aldım! 🎯 Tüm emeklerimin karşılığını aldım. Çalışmanın önemi bir kez daha anlaşıldı!',
    authorId: 'student4',
    authorName: 'Elif Korkmaz',
    authorRole: 'student',
    type: 'achievement',
    timestamp: '2024-01-12T14:20:00Z',
    likes: 45,
    comments: [
      {
        id: '4',
        postId: '4',
        authorId: 'student1',
        authorName: 'Ayşe Kaya',
        authorRole: 'student',
        content: 'Vay canına! Tebrikler Elif! 👏',
        timestamp: '2024-01-12T14:30:00Z',
        likes: 6
      },
      {
        id: '5',
        postId: '4',
        authorId: 'teacher1',
        authorName: 'Ahmet Yılmaz',
        authorRole: 'teacher',
        content: 'Harika başarı! Gurur duydum 🌟',
        timestamp: '2024-01-12T14:45:00Z',
        likes: 12
      },
      {
        id: '6',
        postId: '4',
        authorId: 'student2',
        authorName: 'Mehmet Demir',
        authorRole: 'student',
        content: 'Seninle gurur duyuyoruz! 💪',
        timestamp: '2024-01-12T15:00:00Z',
        likes: 4
      }
    ],
    tags: ['başarı', '100', 'matematik']
  },
  {
    id: '5',
    content: 'Okulumuzda bu yıl bilim şenliği düzenlenecek. Projelerini hazırlamaya başlayabilirsiniz. Son başvuru: 1 Şubat 🏆',
    authorId: 'admin1',
    authorName: 'Okul Yönetimi',
    authorRole: 'admin',
    type: 'announcement',
    timestamp: '2024-01-11T08:00:00Z',
    likes: 32,
    comments: [
      {
        id: '7',
        postId: '5',
        authorId: 'student3',
        authorName: 'Zeynep Arslan',
        authorRole: 'student',
        content: 'Harika! Katılmak istiyorum 🚀',
        timestamp: '2024-01-11T08:30:00Z',
        likes: 7
      }
    ],
    tags: ['bilim şenliği', 'proje', 'etkinlik']
  },
  {
    id: '6',
    content: 'Geçen haftaki Türkçe kompozisyon yarışmasında sınıfımız birinci oldu! 🎉 Herkesin emeği için teşekkürler',
    authorId: 'teacher4',
    authorName: 'Ayşe Yıldız',
    authorRole: 'teacher',
    type: 'achievement',
    timestamp: '2024-01-10T12:00:00Z',
    likes: 28,
    comments: [
      {
        id: '8',
        postId: '6',
        authorId: 'student4',
        authorName: 'Elif Korkmaz',
        authorRole: 'student',
        content: 'Birlikte başardık! 🎊',
        timestamp: '2024-01-10T12:15:00Z',
        likes: 9
      },
      {
        id: '9',
        postId: '6',
        authorId: 'student5',
        authorName: 'Can Polat',
        authorRole: 'student',
        content: 'Gurur duyduk öğretmenim! 🙏',
        timestamp: '2024-01-10T12:30:00Z',
        likes: 5
      }
    ],
    tags: ['türkçe', 'yarışma', 'başarı']
  }
]

export const getFeedPostsByFilter = (filter?: 'all' | 'my-class' | 'my-posts') => {
  if (filter === 'all') return demoFeedPosts
  if (filter === 'my-class') return demoFeedPosts.slice(0, 4) // Sınıf ile ilgili gönderiler
  if (filter === 'my-posts') return demoFeedPosts.filter(post => post.authorRole === 'student') // Sadece öğrenci gönderileri
  return demoFeedPosts
}

export const getFeedPostById = (id: string) => {
  return demoFeedPosts.find(post => post.id === id)
}