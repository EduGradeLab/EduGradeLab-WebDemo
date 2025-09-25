import { Student, Grade, Achievement, Analytics } from './types'

export const demoStudents: Student[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@demo.com',
    studentNumber: '2024001',
    classId: '1',
    grade: 10,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse.demir@demo.com',
    studentNumber: '2024002',
    classId: '1',
    grade: 10,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet.kaya@demo.com',
    studentNumber: '2024003',
    classId: '2',
    grade: 11,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '4',
    name: 'Zeynep Çelik',
    email: 'zeynep.celik@demo.com',
    studentNumber: '2024004',
    classId: '2',
    grade: 11,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '5',
    name: 'Mustafa Arslan',
    email: 'mustafa.arslan@demo.com',
    studentNumber: '2024005',
    classId: '3',
    grade: 12,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '6',
    name: 'Fatma Öztürk',
    email: 'fatma.ozturk@demo.com',
    studentNumber: '2024006',
    classId: '3',
    grade: 12,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '7',
    name: 'Ali Veli',
    email: 'ali.veli@demo.com',
    studentNumber: '2024007',
    classId: '1',
    grade: 10,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '8',
    name: 'Elif Korkmaz',
    email: 'elif.korkmaz@demo.com',
    studentNumber: '2024008',
    classId: '1',
    grade: 10,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '9',
    name: 'Can Polat',
    email: 'can.polat@demo.com',
    studentNumber: '2024009',
    classId: '2',
    grade: 11,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '10',
    name: 'Burak Gün',
    email: 'burak.gun@demo.com',
    studentNumber: '2024010',
    classId: '2',
    grade: 11,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '11',
    name: 'Sude Ak',
    email: 'sude.ak@demo.com',
    studentNumber: '2024011',
    classId: '3',
    grade: 12,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '12',
    name: 'Onur Çınar',
    email: 'onur.cinar@demo.com',
    studentNumber: '2024012',
    classId: '3',
    grade: 12,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '13',
    name: 'Yağmur Yıldız',
    email: 'yagmur.yildiz@demo.com',
    studentNumber: '2024013',
    classId: '4',
    grade: 9,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '14',
    name: 'Efe Kuş',
    email: 'efe.kus@demo.com',
    studentNumber: '2024014',
    classId: '4',
    grade: 9,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '15',
    name: 'Derin Su',
    email: 'derin.su@demo.com',
    studentNumber: '2024015',
    classId: '5',
    grade: 8,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '16',
    name: 'Arda Dağ',
    email: 'arda.dag@demo.com',
    studentNumber: '2024016',
    classId: '5',
    grade: 8,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '17',
    name: 'Lara Gökyüzü',
    email: 'lara.gokyuzu@demo.com',
    studentNumber: '2024017',
    classId: '6',
    grade: 7,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '18',
    name: 'Mert Ateş',
    email: 'mert.ates@demo.com',
    studentNumber: '2024018',
    classId: '6',
    grade: 7,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  },
  {
    id: '19',
    name: 'Selin Rüzgar',
    email: 'selin.ruzgar@demo.com',
    studentNumber: '2024019',
    classId: '7',
    grade: 6,
    joinDate: '2024-09-01',
    avatar: '👩‍🎓'
  },
  {
    id: '20',
    name: 'Kaan Yıldırım',
    email: 'kaan.yildirim@demo.com',
    studentNumber: '2024020',
    classId: '7',
    grade: 6,
    joinDate: '2024-09-01',
    avatar: '👨‍🎓'
  }
]

export const demoGrades: Grade[] = [
  // Ahmet Yılmaz - Notları
  {
    id: '1',
    studentId: '1',
    examId: '1',
    score: 85,
    maxScore: 100,
    feedback: 'Matematik konularında iyi performans, geometri konusunda gelişme gösterebilir.',
    gradedAt: '2024-09-15'
  },
  {
    id: '2',
    studentId: '1',
    examId: '2',
    score: 92,
    maxScore: 100,
    feedback: 'Mükemmel performans, tüm soruları doğru cevaplamış.',
    gradedAt: '2024-09-20'
  },
  {
    id: '3',
    studentId: '1',
    examId: '3',
    score: 78,
    maxScore: 100,
    feedback: 'Fizik problemlerinde zorlanıyor, daha fazla pratik yapması önerilir.',
    gradedAt: '2024-09-25'
  },
  {
    id: '4',
    studentId: '1',
    examId: '4',
    score: 88,
    maxScore: 100,
    feedback: 'Kimya sınavında başarılı, formülleri iyi kullanmış.',
    gradedAt: '2024-10-01'
  },
  {
    id: '5',
    studentId: '1',
    examId: '5',
    score: 95,
    maxScore: 100,
    feedback: 'Türkçe kompozisyon yazmada çok yetenekli.',
    gradedAt: '2024-10-05'
  },

  // Ayşe Demir - Notları
  {
    id: '6',
    studentId: '2',
    examId: '1',
    score: 95,
    maxScore: 100,
    feedback: 'Olağanüstü başarılı, matematikte sınıfın en iyisi.',
    gradedAt: '2024-09-15'
  },
  {
    id: '7',
    studentId: '2',
    examId: '2',
    score: 88,
    maxScore: 100,
    feedback: 'Çok iyi performans, sadece birkaç küçük hata yapmış.',
    gradedAt: '2024-09-20'
  },
  {
    id: '8',
    studentId: '2',
    examId: '3',
    score: 91,
    maxScore: 100,
    feedback: 'Fizik konularında gayet başarılı.',
    gradedAt: '2024-09-25'
  },
  {
    id: '9',
    studentId: '2',
    examId: '4',
    score: 97,
    maxScore: 100,
    feedback: 'Kimyada mükemmel, laboratuvar çalışmaları çok iyi.',
    gradedAt: '2024-10-01'
  },
  {
    id: '10',
    studentId: '2',
    examId: '5',
    score: 93,
    maxScore: 100,
    feedback: 'Edebiyat metin analizinde çok başarılı.',
    gradedAt: '2024-10-05'
  },

  // Mehmet Kaya - Notları
  {
    id: '11',
    studentId: '3',
    examId: '1',
    score: 82,
    maxScore: 100,
    feedback: 'İyi performans, daha fazla pratik yapmalı.',
    gradedAt: '2024-09-15'
  },
  {
    id: '12',
    studentId: '3',
    examId: '2',
    score: 79,
    maxScore: 100,
    feedback: 'Ortalama üzerinde, bazı konularda eksik var.',
    gradedAt: '2024-09-20'
  },
  {
    id: '13',
    studentId: '3',
    examId: '3',
    score: 85,
    maxScore: 100,
    feedback: 'Fizikte gösterdiği gelişme takdir edilmeli.',
    gradedAt: '2024-09-25'
  },
  {
    id: '14',
    studentId: '3',
    examId: '4',
    score: 76,
    maxScore: 100,
    feedback: 'Kimya formüllerinde zorlanıyor, tekrar etmeli.',
    gradedAt: '2024-10-01'
  },
  {
    id: '15',
    studentId: '3',
    examId: '5',
    score: 81,
    maxScore: 100,
    feedback: 'Türkçe gramer konularında iyi.',
    gradedAt: '2024-10-05'
  },

  // Diğer öğrencilerin notları...
  {
    id: '16',
    studentId: '4',
    examId: '1',
    score: 88,
    maxScore: 100,
    feedback: 'Matematikte yetenekli, hızlı problem çözüyor.',
    gradedAt: '2024-09-15'
  },
  {
    id: '17',
    studentId: '4',
    examId: '2',
    score: 84,
    maxScore: 100,
    feedback: 'İyi çalışma disiplini gösteriyor.',
    gradedAt: '2024-09-20'
  },
  {
    id: '18',
    studentId: '5',
    examId: '1',
    score: 91,
    maxScore: 100,
    feedback: 'Matematikte sınıfın en başarılılarından.',
    gradedAt: '2024-09-15'
  },
  {
    id: '19',
    studentId: '5',
    examId: '2',
    score: 89,
    maxScore: 100,
    feedback: 'Fizik problemlerini rahat çözüyor.',
    gradedAt: '2024-09-20'
  },
  {
    id: '20',
    studentId: '6',
    examId: '1',
    score: 86,
    maxScore: 100,
    feedback: 'Sürekli gelişim gösteriyor.',
    gradedAt: '2024-09-15'
  },
  {
    id: '21',
    studentId: '6',
    examId: '2',
    score: 83,
    maxScore: 100,
    feedback: 'Derslere aktif katılım sağlıyor.',
    gradedAt: '2024-09-20'
  },
  {
    id: '22',
    studentId: '7',
    examId: '1',
    score: 79,
    maxScore: 100,
    feedback: 'Potansiyeli yüksek, daha fazla çalışmalı.',
    gradedAt: '2024-09-15'
  },
  {
    id: '23',
    studentId: '7',
    examId: '2',
    score: 82,
    maxScore: 100,
    feedback: 'Geometri konularında gelişme gösterdi.',
    gradedAt: '2024-09-20'
  },
  {
    id: '24',
    studentId: '8',
    examId: '1',
    score: 94,
    maxScore: 100,
    feedback: 'Mükemmel matematik yeteneği.',
    gradedAt: '2024-09-15'
  },
  {
    id: '25',
    studentId: '8',
    examId: '2',
    score: 90,
    maxScore: 100,
    feedback: 'Soruları dikkatli çözüyor.',
    gradedAt: '2024-09-20'
  }
]

export const demoAchievements: Achievement[] = [
  {
    id: '1',
    studentId: '1',
    title: 'Matematik Ustası',
    description: 'Matematik sınavında 85+ puan aldı',
    icon: '🏆',
    date: '2024-09-15',
    type: 'grade'
  },
  {
    id: '2',
    studentId: '2',
    title: 'Mükemmeliyetçi',
    description: '3 sınavda 90+ puan aldı',
    icon: '⭐',
    date: '2024-09-25',
    type: 'grade'
  },
  {
    id: '3',
    studentId: '1',
    title: 'Düzenli Öğrenci',
    description: 'Tüm ödevlerini zamanında teslim etti',
    icon: '📚',
    date: '2024-09-10',
    type: 'participation'
  },
  {
    id: '4',
    studentId: '3',
    title: 'En Çok Gelişen',
    description: 'Son sınavda en çok puan artışı',
    icon: '📈',
    date: '2024-09-20',
    type: 'improvement'
  },
  {
    id: '5',
    studentId: '2',
    title: 'Laboratuvar Uzmanı',
    description: 'Kimya deneylerinde mükemmel performans',
    icon: '🧪',
    date: '2024-10-01',
    type: 'grade'
  },
  {
    id: '6',
    studentId: '4',
    title: 'Hızlı Çözücü',
    description: 'Matematik problemlerini en hızlı çözen öğrenci',
    icon: '⚡',
    date: '2024-09-15',
    type: 'grade'
  },
  {
    id: '7',
    studentId: '5',
    title: 'Fizik Dehası',
    description: 'Fizik sınavında sınıf birincisi',
    icon: '🔬',
    date: '2024-09-20',
    type: 'grade'
  },
  {
    id: '8',
    studentId: '6',
    title: 'Katkılı Öğrenci',
    description: 'Derslerde en aktif katılım sağlayan öğrenci',
    icon: '🤝',
    date: '2024-09-25',
    type: 'participation'
  },
  {
    id: '9',
    studentId: '8',
    title: 'Mükemmel Not',
    description: 'Tüm sınavlarda 90+ ortalaması',
    icon: '💯',
    date: '2024-10-01',
    type: 'grade'
  },
  {
    id: '10',
    studentId: '1',
    title: 'Edebiyat Sanatçısı',
    description: 'Türkçe kompozisyon yazmada üstün başarı',
    icon: '📝',
    date: '2024-10-05',
    type: 'grade'
  }
]

export const demoStudentAnalytics: Analytics[] = [
  {
    studentId: '1',
    averageScore: 87,
    totalExams: 5,
    improvement: 15,
    rank: 2,
    classAverage: 82,
    weaknesses: ['Fizik', 'Geometri'],
    strengths: ['Cebir', 'Aritmetik', 'Türkçe']
  },
  {
    studentId: '2',
    averageScore: 93,
    totalExams: 5,
    improvement: 8,
    rank: 1,
    classAverage: 82,
    weaknesses: [],
    strengths: ['Matematik', 'Fizik', 'Kimya', 'Türkçe']
  },
  {
    studentId: '3',
    averageScore: 81,
    totalExams: 5,
    improvement: 12,
    rank: 5,
    classAverage: 78,
    weaknesses: ['Trigonometri', 'Kimya'],
    strengths: ['Cebir', 'Fizik']
  },
  {
    studentId: '4',
    averageScore: 86,
    totalExams: 2,
    improvement: 10,
    rank: 3,
    classAverage: 78,
    weaknesses: ['Edebiyat'],
    strengths: ['Matematik', 'Fizik']
  },
  {
    studentId: '5',
    averageScore: 90,
    totalExams: 2,
    improvement: 18,
    rank: 1,
    classAverage: 85,
    weaknesses: [],
    strengths: ['Matematik', 'Fizik', 'Kimya']
  },
  {
    studentId: '6',
    averageScore: 84,
    totalExams: 2,
    improvement: 7,
    rank: 4,
    classAverage: 85,
    weaknesses: ['Matematik'],
    strengths: ['Fizik', 'Türkçe']
  },
  {
    studentId: '7',
    averageScore: 80,
    totalExams: 2,
    improvement: 14,
    rank: 6,
    classAverage: 82,
    weaknesses: ['Cebir'],
    strengths: ['Geometri', 'Türkçe']
  },
  {
    studentId: '8',
    averageScore: 92,
    totalExams: 2,
    improvement: 5,
    rank: 1,
    classAverage: 82,
    weaknesses: [],
    strengths: ['Matematik', 'Fizik', 'Kimya']
  }
]