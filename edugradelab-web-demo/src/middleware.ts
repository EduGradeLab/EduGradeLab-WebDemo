import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Demo kullanıcı oturum yönetimi - sadece cookie kontrolü
  const sessionToken = request.cookies.get('session_token')?.value
  
  // Eğer session token yoksa ve demo sayfalarına erişmeye çalışıyorsa, yeni token oluştur
  if (!sessionToken && (request.nextUrl.pathname === '/demologin' || request.nextUrl.pathname === '/demohome')) {
    const newSessionToken = generateSessionToken()
    
    const response = NextResponse.next()
    response.cookies.set('session_token', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    // Header'a session token ekle
    response.headers.set('x-session-token', newSessionToken)
    
    return response
  }
  
  // Eğer session token varsa, header'a ekle
  if (sessionToken) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-session-token', sessionToken)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  return NextResponse.next()
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}