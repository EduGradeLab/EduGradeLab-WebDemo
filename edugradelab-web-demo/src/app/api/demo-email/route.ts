import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Invalid JSON in demo email request:', parseError)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const { email, name } = body
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Session tabanlı kullanıcı bilgisi al
    const user = await getUserFromRequest(request)
    const userId = user?.id || null

    // Check if email already exists
    try {
      const existingEmail = await prisma.demo_emails.findUnique({
        where: { email }
      })
      
      if (existingEmail) {
        return NextResponse.json({ 
          success: true, 
          message: 'Email already registered',
          id: existingEmail.id 
        })
      }
    } catch (dbError) {
      console.error('Database error while checking existing email:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // E-posta kaydet
    try {
      const demoEmail = await prisma.demo_emails.create({
        data: {
          user_id: userId, // null olabilir
          email,
          name: name || email.split('@')[0], // name yoksa email'den türet
        }
      })

      return NextResponse.json({ 
        success: true, 
        id: demoEmail.id,
        message: 'Email saved successfully'
      })
    } catch (dbError) {
      console.error('Database error while saving demo email:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } catch (error) {
    console.error('Demo email save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}