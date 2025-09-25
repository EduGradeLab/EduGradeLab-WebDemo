export * from './types'
export * from './students'
export * from './teachers'
export * from './classes'
export * from './badges'
export * from './admin'
export * from './feed'
export * from './chat'

// Import all demo data for helper functions
import { demoStudents } from './students'
import { demoTeachers } from './teachers'
import { demoClasses, demoExams } from './classes'
import { demoBadges, demoStudentBadges } from './badges'
import { demoGrades, demoAchievements, demoStudentAnalytics } from './students'

// Helper functions for demo data
export const getStudentById = (id: string) => {
  return demoStudents.find(student => student.id === id)
}

export const getTeacherById = (id: string) => {
  return demoTeachers.find(teacher => teacher.id === id)
}

export const getClassById = (id: string) => {
  return demoClasses.find(cls => cls.id === id)
}

export const getExamById = (id: string) => {
  return demoExams.find(exam => exam.id === id)
}

export const getBadgeById = (id: string) => {
  return demoBadges.find(badge => badge.id === id)
}

export const getGradesByStudentId = (studentId: string) => {
  return demoGrades.filter(grade => grade.studentId === studentId)
}

export const getAchievementsByStudentId = (studentId: string) => {
  return demoAchievements.filter(achievement => achievement.studentId === studentId)
}

export const getAnalyticsByStudentId = (studentId: string) => {
  return demoStudentAnalytics.find(analytics => analytics.studentId === studentId)
}

export const getStudentBadges = (studentId: string) => {
  const studentBadgeIds = demoStudentBadges
    .filter(sb => sb.studentId === studentId)
    .map(sb => sb.badgeId)

  return demoBadges.filter(badge => studentBadgeIds.includes(badge.id))
}

export const getClassesByTeacherId = (teacherId: string) => {
  return demoClasses.filter(cls => cls.teacherId === teacherId)
}

export const getExamsByClassId = (classId: string) => {
  return demoExams.filter(exam => exam.classId === classId)
}

export const getStudentsByClassId = (classId: string) => {
  return demoStudents.filter(student => student.classId === classId)
}

export const getTeacherPerformance = () => {
  return demoTeachers.map(teacher => {
    const classes = getClassesByTeacherId(teacher.id)
    const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0)
    const avgPerformance = 75 + Math.random() * 20 // Random performance between 75-95

    return {
      ...teacher,
      totalClasses: classes.length,
      totalStudents,
      avgPerformance: Math.round(avgPerformance)
    }
  })
}

export const getClassStats = () => {
  return demoClasses.map(cls => {
    const students = getStudentsByClassId(cls.id)
    const exams = getExamsByClassId(cls.id)
    const avgGrade = 70 + Math.random() * 25 // Random average between 70-95

    return {
      ...cls,
      students,
      exams,
      avgGrade: Math.round(avgGrade),
      completionRate: Math.round(80 + Math.random() * 20) // 80-100%
    }
  })
}