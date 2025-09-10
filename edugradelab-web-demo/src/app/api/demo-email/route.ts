import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    
    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    let userIdInt
    try {
      userIdInt = parseInt(userId)
      if (isNaN(userIdInt)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 })
    }

    // Check if email already exists
    try {
      const existingEmail = await prisma.demo_emails.findUnique({
        where: { email }
      })
      
      if (existingEmail) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
      }
    } catch (dbError) {
      console.error('Database error while checking existing email:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // E-posta kaydet
    try {
      const demoEmail = await prisma.demo_emails.create({
        data: {
          user_id: userIdInt,
          email,
          name,
        }
      })

      return NextResponse.json({ 
        success: true, 
        id: demoEmail.id 
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