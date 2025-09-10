import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name required' }, { status: 400 })
    }

    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // E-posta kaydet
    const demoEmail = await prisma.demo_emails.create({
      data: {
        user_id: parseInt(userId),
        email,
        name,
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: demoEmail.id 
    })
  } catch (error) {
    console.error('Demo email save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}