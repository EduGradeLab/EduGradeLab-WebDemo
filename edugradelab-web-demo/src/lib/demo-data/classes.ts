import { Class, Exam } from './types'

export const demoClasses: Class[] = [
  {
    id: '1',
    name: '10-A Sınıfı',
    teacherId: '1',
    grade: 10,
    subject: 'Matematik',
    studentCount: 28,
    description: '10. sınıf matematik dersi',
    code: 'MATH10A',
    schedule: 'Pazartesi-Çarşamba-Cuma 09:00-10:30',
    room: '101',
    syllabus: 'Cebir, Geometri, Trigonometri, Olasılık'
  },
  {
    id: '2',
    name: '11-B Sınıfı',
    teacherId: '2',
    grade: 11,
    subject: 'Fizik',
    studentCount: 25,
    description: '11. sınıf fizik dersi',
    code: 'PHYS11B',
    schedule: 'Salı-Perşembe 10:45-12:15',
    room: 'Lab-1',
    syllabus: 'Mekanik, Elektrik, Manyetizma, Modern Fizik'
  },
  {
    id: '3',
    name: '12-C Sınıfı',
    teacherId: '3',
    grade: 12,
    subject: 'Kimya',
    studentCount: 22,
    description: '12. sınıf kimya dersi',
    code: 'CHEM12C',
    schedule: 'Pazartesi-Perşembe 14:00-15:30',
    room: 'Lab-2',
    syllabus: 'Organik Kimya, Anorganik Kimya, Fizikokimya'
  },
  {
    id: '4',
    name: '10-B Sınıfı',
    teacherId: '4',
    grade: 10,
    subject: 'Türkçe',
    studentCount: 26,
    description: '10. sınıf Türkçe dersi',
    code: 'TURK10B',
    schedule: 'Salı-Çarşamba-Cuma 08:00-09:30',
    room: '102',
    syllabus: 'Edebiyat, Dil Bilgisi, Kompozisyon, Okuma'
  },
  {
    id: '5',
    name: '9-A Sınıfı',
    teacherId: '1',
    grade: 9,
    subject: 'Matematik',
    studentCount: 24,
    description: '9. sınıf matematik dersi',
    code: 'MATH9A',
    schedule: 'Pazartesi-Çarşamba-Cuma 11:00-12:30',
    room: '103',
    syllabus: 'Temel Matematik, Cebir, Geometri'
  },
  {
    id: '6',
    name: '8-A Sınıfı',
    teacherId: '2',
    grade: 8,
    subject: 'Fen Bilgisi',
    studentCount: 23,
    description: '8. sınıf fen bilgisi dersi',
    code: 'SCI8A',
    schedule: 'Salı-Perşembe 13:00-14:30',
    room: 'Lab-3',
    syllabus: 'Fizik, Kimya, Biyoloji, Astronomi'
  },
  {
    id: '7',
    name: '7-A Sınıfı',
    teacherId: '3',
    grade: 7,
    subject: 'Sosyal Bilgiler',
    studentCount: 22,
    description: '7. sınıf sosyal bilgiler dersi',
    code: 'SOC7A',
    schedule: 'Pazartesi-Perşembe 10:00-11:30',
    room: '104',
    syllabus: 'Tarih, Coğrafya, Vatandaşlık'
  }
]

export const demoExams: Exam[] = [
  {
    id: '1',
    title: 'Matematik Vize 1',
    classId: '1',
    date: '2024-09-15',
    duration: 120,
    totalPoints: 100,
    type: 'midterm',
    description: 'Cebir ve Geometri konularını kapsar',
    instructions: 'Hesap makinesi kullanılabilir, formül kağıtı götürülebilir'
  },
  {
    id: '2',
    title: 'Matematik Kısa Sınav',
    classId: '1',
    date: '2024-09-20',
    duration: 45,
    totalPoints: 100,
    type: 'quiz',
    description: 'Trigonometri ve Fonksiyonlar',
    instructions: 'Formülsüz çözüm gerekli'
  },
  {
    id: '3',
    title: 'Fizik Laboratuvar',
    classId: '2',
    date: '2024-09-25',
    duration: 90,
    totalPoints: 100,
    type: 'assignment',
    description: 'Mekanik Deneyleri',
    instructions: 'Laboratuvar raporu hazırlanacak'
  },
  {
    id: '4',
    title: 'Kimya Proje',
    classId: '3',
    date: '2024-09-10',
    duration: 60,
    totalPoints: 100,
    type: 'assignment',
    description: 'Organik Bileşikler Araştırması',
    instructions: 'Sunum ve poster hazırlama'
  },
  {
    id: '5',
    title: 'Türkçe Kompozisyon',
    classId: '4',
    date: '2024-09-18',
    duration: 90,
    totalPoints: 100,
    type: 'midterm',
    description: 'Giriş-Gelişme-Sonuç kompozisyon yazma',
    instructions: 'En az 300 kelime, özgün içerik'
  },
  {
    id: '6',
    title: 'Matematik Final',
    classId: '1',
    date: '2024-12-15',
    duration: 150,
    totalPoints: 100,
    type: 'final',
    description: 'Tüm ders konuları',
    instructions: 'Tüm konulardan sorumluluk'
  },
  {
    id: '7',
    title: 'Fizik Vize',
    classId: '2',
    date: '2024-10-05',
    duration: 120,
    totalPoints: 100,
    type: 'midterm',
    description: 'Elektrik ve Manyetizma',
    instructions: 'Hesap makinesi gerekli'
  },
  {
    id: '8',
    title: 'Kimya Vize',
    classId: '3',
    date: '2024-10-12',
    duration: 120,
    totalPoints: 100,
    type: 'midterm',
    description: 'Kimyasal Denklemler ve Stokiometri',
    instructions: 'Periyodik tablo verilecek'
  },
  {
    id: '9',
    title: 'Türkçe Sözlü Sınav',
    classId: '4',
    date: '2024-10-20',
    duration: 30,
    totalPoints: 100,
    type: 'quiz',
    description: 'Kitap tahlili sunumu',
    instructions: '5 dakikalık sunum'
  },
  {
    id: '10',
    title: 'Fizik Final',
    classId: '2',
    date: '2024-12-18',
    duration: 150,
    totalPoints: 100,
    type: 'final',
    description: 'Yıl sonu genel tekrar',
    instructions: 'Tüm konular sorumluluk'
  },
  {
    id: '11',
    title: '9. Sınıf Matematik Ara Sınav',
    classId: '5',
    date: '2024-09-22',
    duration: 90,
    totalPoints: 100,
    type: 'midterm',
    description: 'Temel Cebir ve Geometri',
    instructions: 'Formülsüz çözüm'
  },
  {
    id: '12',
    title: '8. Sınıf Fen Bilgisi Proje',
    classId: '6',
    date: '2024-10-01',
    duration: 120,
    totalPoints: 100,
    type: 'assignment',
    description: 'Su Döngüsü Modeli',
    instructions: '3D model hazırlama'
  },
  {
    id: '13',
    title: '7. Sınıf Sosyal Bilgiler Sunum',
    classId: '7',
    date: '2024-10-15',
    duration: 45,
    totalPoints: 100,
    type: 'quiz',
    description: 'Selçuklu İmparatorluğu',
    instructions: 'PowerPoint sunumu'
  },
  {
    id: '14',
    title: '10. Sınıf Matematik Ödev',
    classId: '1',
    date: '2024-09-28',
    duration: 0,
    totalPoints: 100,
    type: 'assignment',
    description: 'Fonksiyon Çizimleri',
    instructions: 'Online teslim'
  },
  {
    id: '15',
    title: '11. Sınıf Fizik Kısa Sınav',
    classId: '2',
    date: '2024-10-08',
    duration: 30,
    totalPoints: 100,
    type: 'quiz',
    description: 'Enerji ve İş',
    instructions: 'Çoktan seçmeli'
  }
]