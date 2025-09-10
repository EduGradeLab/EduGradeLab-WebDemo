import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Demo kullanıcıyı getir veya oluştur
export async function getOrCreateDemoUser(sessionToken: string, clientIP: string) {
  try {
    // Önce mevcut kullanıcıyı ara
    let user = await prisma.users.findUnique({
      where: { session_token: sessionToken }
    })

    // Kullanıcı yoksa oluştur
    if (!user) {
      user = await prisma.users.create({
        data: {
          session_token: sessionToken,
          ip_address: clientIP,
          is_demo_user: true
        }
      })
    }

    // Son aktiviteyi güncelle
    await prisma.users.update({
      where: { id: user.id },
      data: { last_active_at: new Date() }
    })

    return user
  } catch (error) {
    console.error('Demo user creation error:', error)
    // Hata durumunda geçici kullanıcı ID'si döndür
    return { id: 1, session_token: sessionToken, is_demo_user: true }
  }
}

// Request'ten kullanıcı bilgilerini al
export async function getUserFromRequest(request: NextRequest) {
  const sessionToken = request.headers.get('x-session-token') || 
                      request.cookies.get('session_token')?.value
  
  if (!sessionToken) {
    return null
  }

  // Client IP'yi al
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'

  return await getOrCreateDemoUser(sessionToken, clientIP)
}

// Request'e kullanıcı bilgilerini ekle
export function addUserToRequest(request: NextRequest, userId: number, sessionToken: string) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', userId.toString())
  requestHeaders.set('x-session-token', sessionToken)
  
  return requestHeaders
}