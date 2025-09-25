export interface Student {
  id: string
  name: string
  email: string
  studentNumber: string
  classId: string
  grade: number
  avatar?: string
  joinDate: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  branch: string
  title: string
  avatar?: string
  joinDate: string
  phone?: string
  office?: string
  department?: string
  experience?: string
  education?: string
  expertise?: string[]
  publications?: number
  awards?: string[]
  rating?: number
}

export interface Class {
  id: string
  name: string
  teacherId: string
  grade: number
  subject: string
  studentCount: number
  description?: string
  code: string
  schedule?: string
  room?: string
  syllabus?: string
}

export interface Exam {
  id: string
  title: string
  classId: string
  date: string
  duration: number
  totalPoints: number
  type: 'quiz' | 'midterm' | 'final' | 'assignment'
  description?: string
  instructions?: string
}

export interface Grade {
  id: string
  studentId: string
  examId: string
  score: number
  maxScore: number
  feedback?: string
  gradedAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  criteria: string
  category?: string
  rarity?: string
}

export interface StudentBadge {
  studentId: string
  badgeId: string
  earnedAt: string
}

export interface Achievement {
  id: string
  studentId: string
  title: string
  description: string
  icon: string
  date: string
  type: 'grade' | 'attendance' | 'participation' | 'improvement'
}

export interface Analytics {
  studentId: string
  averageScore: number
  totalExams: number
  improvement: number
  rank: number
  classAverage: number
  weaknesses: string[]
  strengths: string[]
}

export interface SystemLog {
  id: string
  type: 'user_action' | 'exam_created' | 'grade_updated' | 'system_backup' | 'user_registration' | 'error' | 'batch_operation' | 'security' | 'export' | 'maintenance'
  action: string
  details: string
  timestamp: string
  user: string
  severity: 'info' | 'success' | 'warning' | 'error'
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalExams: number
  totalGrades: number
  totalClasses: number
  systemUptime: string
  lastBackup: string
  serverLoad: string
  memoryUsage: string
  diskUsage: string
  apiResponseTime: string
  errorRate: string
  activeSessions: number
  dailyLogins: number
  weeklyLogins: number
  monthlyLogins: number
}

export interface UserActivity {
  id: string
  userId: string
  userName: string
  action: string
  timestamp: string
  type: 'exam_created' | 'grade_updated' | 'assignment_graded' | 'report_generated' | 'lab_scheduled' | 'presentation_graded' | 'lab_report_reviewed' | 'results_published' | 'assignment_collected'
  details: string
}

export interface AdminNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export interface SystemHealth {
  name: string
  value: string
  status: 'excellent' | 'good' | 'warning' | 'error'
  icon: string
  description: string
}

// Feed and Chat Types
export interface FeedPost {
  id: string
  content: string
  authorId: string
  authorName: string
  authorRole: 'student' | 'teacher' | 'admin'
  type: 'announcement' | 'achievement' | 'reminder' | 'general'
  timestamp: string
  likes: number
  comments: Comment[]
  attachments?: string[]
  tags?: string[]
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorRole: 'student' | 'teacher' | 'admin'
  content: string
  timestamp: string
  likes: number
}

export interface ChatChannel {
  id: string
  name: string
  type: 'class' | 'subject' | 'school' | 'general'
  description?: string
  memberCount: number
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

export interface ChatMessage {
  id: string
  channelId: string
  authorId: string
  authorName: string
  authorRole: 'student' | 'teacher' | 'admin'
  content: string
  timestamp: string
  type: 'text' | 'announcement' | 'system'
}