import { Badge, StudentBadge } from './types'

export const demoBadges: Badge[] = [
  {
    id: '1',
    name: 'Matematik Dehası',
    description: 'Matematik sınavında 95+ puan al',
    icon: '🧮',
    color: 'blue',
    criteria: '95+ puan',
    category: 'akademik',
    rarity: 'nadir'
  },
  {
    id: '2',
    name: 'Fizik Uzmanı',
    description: 'Fizik sınavında 90+ puan al',
    icon: '⚛️',
    color: 'purple',
    criteria: '90+ puan',
    category: 'akademik',
    rarity: 'nadir'
  },
  {
    id: '3',
    name: 'Kimya Starı',
    description: 'Kimya sınavında 85+ puan al',
    icon: '🧪',
    color: 'green',
    criteria: '85+ puan',
    category: 'akademik',
    rarity: 'sık'
  },
  {
    id: '4',
    name: 'Düzenli Öğrenci',
    description: '1 ay boyunca tüm ödevlerini zamanında teslim et',
    icon: '📚',
    color: 'yellow',
    criteria: 'Zamanında teslim',
    category: 'disiplin',
    rarity: 'sık'
  },
  {
    id: '5',
    name: 'En Çok Gelişen',
    description: 'Sınavda en çok puan artışını göster',
    icon: '📈',
    color: 'orange',
    criteria: 'En fazla gelişim',
    category: 'kişisel',
    rarity: 'nadir'
  },
  {
    id: '6',
    name: 'Sınıf Lideri',
    description: 'Sınıfında en yüksek puana sahip ol',
    icon: '👑',
    color: 'gold',
    criteria: 'Sınıf birincisi',
    category: 'liderlik',
    rarity: 'efsanevi'
  },
  {
    id: '7',
    name: 'Mükemmeliyetçi',
    description: '3 sınavda 90+ puan al',
    icon: '⭐',
    color: 'red',
    criteria: '3x 90+ puan',
    category: 'akademik',
    rarity: 'nadir'
  },
  {
    id: '8',
    name: 'Ekip Oyuncusu',
    description: 'Grup çalışmalarında aktif katılım göster',
    icon: '🤝',
    color: 'indigo',
    criteria: 'Takım çalışması',
    category: 'sosyal',
    rarity: 'sık'
  },
  {
    id: '9',
    name: 'Yaratıcı Yazar',
    description: 'Edebiyat ödevinde 95+ puan al',
    icon: '✍️',
    color: 'pink',
    criteria: '95+ puan',
    category: 'akademik',
    rarity: 'nadir'
  },
  {
    id: '10',
    name: 'Laboratuvar Uzmanı',
    description: 'Laboratuvar çalışmasında mükemmel performans',
    icon: '🔬',
    color: 'teal',
    criteria: 'Lab performansı',
    category: 'akademik',
    rarity: 'nadir'
  },
  {
    id: '11',
    name: 'Katkılı Öğrenci',
    description: 'Derslerde sürekli aktif katılım',
    icon: '🙋',
    color: 'cyan',
    criteria: 'Ders katılımı',
    category: 'katılım',
    rarity: 'sık'
  },
  {
    id: '12',
    name: 'Problem Çözücü',
    description: 'Zor matematik problemlerini çözme',
    icon: '🧩',
    color: 'amber',
    criteria: 'Problem çözme',
    category: 'zeka',
    rarity: 'nadir'
  },
  {
    id: '13',
    name: 'Okuma Tutkunu',
    description: 'Aylık 10+ kitap okuma',
    icon: '📖',
    color: 'emerald',
    criteria: 'Okuma alışkanlığı',
    category: 'kişisel',
    rarity: 'sık'
  },
  {
    id: '14',
    name: 'Sanat Ruhu',
    description: 'Sanat projesinde başarı',
    icon: '🎨',
    color: 'violet',
    criteria: 'Sanat başarısı',
    category: 'sanat',
    rarity: 'nadir'
  },
  {
    id: '15',
    name: 'Spor Kahramanı',
    description: 'Beden eğitiminde üstün performans',
    icon: '⚽',
    color: 'lime',
    criteria: 'Spor başarısı',
    category: 'spor',
    rarity: 'sık'
  }
]

export const demoStudentBadges: StudentBadge[] = [
  {
    studentId: '1',
    badgeId: '1',
    earnedAt: '2024-09-15'
  },
  {
    studentId: '1',
    badgeId: '4',
    earnedAt: '2024-09-10'
  },
  {
    studentId: '1',
    badgeId: '11',
    earnedAt: '2024-09-05'
  },
  {
    studentId: '2',
    badgeId: '1',
    earnedAt: '2024-09-15'
  },
  {
    studentId: '2',
    badgeId: '7',
    earnedAt: '2024-09-25'
  },
  {
    studentId: '2',
    badgeId: '6',
    earnedAt: '2024-10-01'
  },
  {
    studentId: '3',
    badgeId: '5',
    earnedAt: '2024-09-20'
  },
  {
    studentId: '3',
    badgeId: '8',
    earnedAt: '2024-09-28'
  },
  {
    studentId: '4',
    badgeId: '2',
    earnedAt: '2024-09-15'
  },
  {
    studentId: '4',
    badgeId: '10',
    earnedAt: '2024-09-25'
  },
  {
    studentId: '5',
    badgeId: '3',
    earnedAt: '2024-09-20'
  },
  {
    studentId: '5',
    badgeId: '6',
    earnedAt: '2024-10-05'
  },
  {
    studentId: '6',
    badgeId: '9',
    earnedAt: '2024-09-18'
  },
  {
    studentId: '6',
    badgeId: '13',
    earnedAt: '2024-09-30'
  },
  {
    studentId: '7',
    badgeId: '12',
    earnedAt: '2024-09-22'
  },
  {
    studentId: '7',
    badgeId: '4',
    earnedAt: '2024-10-01'
  },
  {
    studentId: '8',
    badgeId: '1',
    earnedAt: '2024-09-15'
  },
  {
    studentId: '8',
    badgeId: '7',
    earnedAt: '2024-09-25'
  },
  {
    studentId: '9',
    badgeId: '14',
    earnedAt: '2024-09-12'
  },
  {
    studentId: '10',
    badgeId: '15',
    earnedAt: '2024-09-20'
  },
  {
    studentId: '11',
    badgeId: '11',
    earnedAt: '2024-09-05'
  },
  {
    studentId: '12',
    badgeId: '8',
    earnedAt: '2024-09-28'
  },
  {
    studentId: '13',
    badgeId: '13',
    earnedAt: '2024-09-30'
  },
  {
    studentId: '14',
    badgeId: '10',
    earnedAt: '2024-09-25'
  },
  {
    studentId: '15',
    badgeId: '5',
    earnedAt: '2024-09-20'
  },
  {
    studentId: '16',
    badgeId: '12',
    earnedAt: '2024-09-22'
  },
  {
    studentId: '17',
    badgeId: '9',
    earnedAt: '2024-09-18'
  },
  {
    studentId: '18',
    badgeId: '15',
    earnedAt: '2024-09-20'
  },
  {
    studentId: '19',
    badgeId: '3',
    earnedAt: '2024-09-20'
  },
  {
    studentId: '20',
    badgeId: '4',
    earnedAt: '2024-10-01'
  }
]