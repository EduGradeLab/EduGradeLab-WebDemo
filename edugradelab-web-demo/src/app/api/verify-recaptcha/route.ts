import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Invalid JSON in reCAPTCHA request:', parseError)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const { token } = body
    
    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 })
    }
    
    // For demo purposes, bypass reCAPTCHA verification
    // In production, you should uncomment the verification code below
    console.log('Demo mode: bypassing reCAPTCHA verification')
    
    return NextResponse.json({ success: true })

    /* Production verification code (uncomment for production):
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    
    if (!secretKey) {
      console.error('reCAPTCHA secret key not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // reCAPTCHA v3 verification
    try {
      const verificationResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
        {
          method: 'POST',
        }
      )

      if (!verificationResponse.ok) {
        throw new Error(`reCAPTCHA API returned status: ${verificationResponse.status}`)
      }

      const verificationData = await verificationResponse.json()

      if (verificationData.success && verificationData.score > 0.5) {
        return NextResponse.json({ success: true })
      } else {
        console.error('reCAPTCHA verification failed:', verificationData)
        return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
      }
    } catch (fetchError) {
      console.error('Error calling reCAPTCHA API:', fetchError)
      return NextResponse.json({ error: 'reCAPTCHA verification error' }, { status: 500 })
    }
    */
  } catch (error) {
    console.error('reCAPTCHA API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}