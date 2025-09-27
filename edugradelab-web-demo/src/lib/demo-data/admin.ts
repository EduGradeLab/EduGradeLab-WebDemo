import { SystemLog, SystemStats, UserActivity } from './types'

export const demoSystemLogs: SystemLog[] = [
  {
    id: '1',
    type: 'user_action',
    action: 'Kullanıcı girişi',
    details: 'Dr. Selin Aksoy sisteme giriş yaptı',
    timestamp: '2024-09-24 09:15:00',
    user: 'Dr. Selin Aksoy',
    severity: 'info'
  },
  {
    id: '2',
    type: 'exam_created',
    action: 'Sınav oluşturma',
    details: '10-A sınıfı için Matematik Vize 1 sınavı oluşturuldu',
    timestamp: '2024-09-24 09:30:00',
    user: 'Dr. Selin Aksoy',
    severity: 'success'
  },
  {
    id: '3',
    type: 'grade_updated',
    action: 'Not güncelleme',
    details: 'Ahmet Yılmaz için Fizik sınavı notu güncellendi: 85',
    timestamp: '2024-09-24 10:15:00',
    user: 'Ahmet Yılmaz',
    severity: 'info'
  },
  {
    id: '4',
    type: 'system_backup',
    action: 'Sistem yedeklemesi',
    details: 'Otomatik sistem yedeklemesi tamamlandı',
    timestamp: '2024-09-24 02:00:00',
    user: 'System',
    severity: 'success'
  },
  {
    id: '5',
    type: 'user_registration',
    action: 'Yeni kullanıcı kaydı',
    details: 'Zeynep Kaya öğretmen olarak sisteme kaydedildi',
    timestamp: '2024-09-24 11:00:00',
    user: 'Admin',
    severity: 'success'
  },
  {
    id: '6',
    type: 'error',
    action: 'Sistem hatası',
    details: 'Veritabanı bağlantı hatası (5 sn)',
    timestamp: '2024-09-24 11:30:00',
    user: 'System',
    severity: 'error'
  },
  {
    id: '7',
    type: 'batch_operation',
    action: 'Toplu notlandırma',
    details: '11-B sınıfı için 25 öğrenci notu girildi',
    timestamp: '2024-09-24 12:00:00',
    user: 'Ahmet Yılmaz',
    severity: 'success'
  },
  {
    id: '8',
    type: 'security',
    action: 'Güvenlik uyarısı',
    details: 'Başarısız giriş denemesi: 3 deneme',
    timestamp: '2024-09-24 12:30:00',
    user: 'System',
    severity: 'warning'
  },
  {
    id: '9',
    type: 'export',
    action: 'Veri dışa aktarma',
    details: '10-A sınıfı notları Excel olarak dışa aktarıldı',
    timestamp: '2024-09-24 13:00:00',
    user: 'Dr. Selin Aksoy',
    severity: 'success'
  },
  {
    id: '10',
    type: 'maintenance',
    action: 'Bakım işlemi',
    details: 'Sistem bakımı tamamlandı, performans iyileştirildi',
    timestamp: '2024-09-24 14:00:00',
    user: 'System',
    severity: 'info'
  }
]

export const demoSystemStats: SystemStats = {
  totalUsers: 254,
  activeUsers: 187,
  totalExams: 156,
  totalGrades: 1248,
  totalClasses: 28,
  systemUptime: '99.9%',
  lastBackup: '2024-09-24 02:00:00',
  serverLoad: '67%',
  memoryUsage: '4.2 GB / 8 GB',
  diskUsage: '156 GB / 500 GB',
  apiResponseTime: '145ms',
  errorRate: '0.1%',
  activeSessions: 48,
  dailyLogins: 125,
  weeklyLogins: 786,
  monthlyLogins: 3241
}

export const demoUserActivities: UserActivity[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Dr. Selin Aksoy',
    action: 'Matematik Vize 1 sınavı oluşturdu',
    timestamp: '2024-09-24 09:30:00',
    type: 'exam_created',
    details: '10-A sınıfı için 100 puanlık sınav'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Ahmet Yılmaz',
    action: 'Öğrenci notlarını güncelledi',
    timestamp: '2024-09-24 10:15:00',
    type: 'grade_updated',
    details: '11-B sınıfı 25 öğrenci'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Zeynep Kaya',
    action: 'Kimya projesini değerlendirdi',
    timestamp: '2024-09-24 11:00:00',
    type: 'assignment_graded',
    details: '12-C sınıfı organik kimya projeleri'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Mehmet Demir',
    action: 'Kompozisyon notlarını girdi',
    timestamp: '2024-09-24 12:00:00',
    type: 'grade_updated',
    details: '10-B sınıfı edebiyat ödevleri'
  },
  {
    id: '5',
    userId: '1',
    userName: 'Dr. Selin Aksoy',
    action: 'Sınıf analizi raporu oluşturdu',
    timestamp: '2024-09-24 13:00:00',
    type: 'report_generated',
    details: '10-A sınıfı performans raporu'
  },
  {
    id: '6',
    userId: '5',
    userName: 'Ayşe Öztürk',
    action: 'Biyoloji deneyini planladı',
    timestamp: '2024-09-24 14:00:00',
    type: 'lab_scheduled',
    details: 'DNA izolasyonu deneyi'
  },
  {
    id: '7',
    userId: '6',
    userName: 'Mustafa Arslan',
    action: 'Tarih sunumunu değerlendirdi',
    timestamp: '2024-09-24 15:00:00',
    type: 'presentation_graded',
    details: '7-A sınıfı Osmanlı tarihi sunumları'
  },
  {
    id: '8',
    userId: '2',
    userName: 'Ahmet Yılmaz',
    action: 'Fizik laboratuvar raporu inceledi',
    timestamp: '2024-09-24 16:00:00',
    type: 'lab_report_reviewed',
    details: '11-B sınıfı mekanik deneyleri'
  },
  {
    id: '9',
    userId: '3',
    userName: 'Zeynep Kaya',
    action: 'Kimya sınav sonuçlarını açıkladı',
    timestamp: '2024-09-24 17:00:00',
    type: 'results_published',
    details: '12-C sınıfı kimya vizesi'
  },
  {
    id: '10',
    userId: '4',
    userName: 'Mehmet Demir',
    action: 'Edebiyat ödevlerini topladı',
    timestamp: '2024-09-24 18:00:00',
    type: 'assignment_collected',
    details: '10-B sınıfı şiir analizleri'
  }
]

export const demoAdminNotifications = [
  {
    id: '1',
    type: 'warning',
    title: 'Sistem Bakımı',
    message: 'Sistem yarın 02:00-04:00 arasında bakım için kapatılacaktır.',
    timestamp: '2024-09-24 19:00:00',
    read: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Yeni Özellik',
    message: 'yapay zeka destekli notlandırma sistemi kullanıma sunuldu.',
    timestamp: '2024-09-24 18:00:00',
    read: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Yedekleme Tamamlandı',
    message: 'Otomatik sistem yedeklemesi başarıyla tamamlandı.',
    timestamp: '2024-09-24 02:00:00',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Bağlantı Hatası',
    message: 'Veritabanı bağlantısında kısa süreli kesinti yaşandı.',
    timestamp: '2024-09-24 11:30:00',
    read: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Kullanıcı Artışı',
    message: 'Bu ay 15 yeni öğretmen sisteme kaydoldu.',
    timestamp: '2024-09-24 10:00:00',
    read: true
  }
]

export const demoSystemHealth = [
  {
    name: 'Sunucu Durumu',
    value: '99.9%',
    status: 'excellent',
    icon: '🖥️',
    description: 'Son 30 gündeki çalışma süresi'
  },
  {
    name: 'Veritabanı',
    value: 'Optimum',
    status: 'good',
    icon: '🗄️',
    description: 'Sorgu süresi: 45ms'
  },
  {
    name: 'API Response',
    value: '145ms',
    status: 'good',
    icon: '⚡',
    description: 'Ortalama yanıt süresi'
  },
  {
    name: 'Disk Kullanımı',
    value: '67%',
    status: 'warning',
    icon: '💾',
    description: '156 GB / 500 GB'
  },
  {
    name: 'Bellek Kullanımı',
    value: '52%',
    status: 'good',
    icon: '🧠',
    description: '4.2 GB / 8 GB'
  },
  {
    name: 'Aktif Kullanıcı',
    value: '187',
    status: 'excellent',
    icon: '👤',
    description: 'Şu anki aktif kullanıcı'
  },
  {
    name: 'Hata Oranı',
    value: '0.1%',
    status: 'excellent',
    icon: '✅',
    description: 'Son 24 saat'
  },
  {
    name: 'Güvenlik',
    value: 'Güvenli',
    status: 'excellent',
    icon: '🔒',
    description: 'Son güvenlik taraması temiz'
  }
]