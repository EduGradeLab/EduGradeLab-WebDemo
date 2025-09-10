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
    
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    
    if (!secretKey) {
      console.error('reCAPTCHA secret key not configured')
      // Demo mode fallback
      console.log('Demo mode: bypassing reCAPTCHA verification')
      return NextResponse.json({ success: true })
    }

    // reCAPTCHA v3 verification
    try {
      const verificationResponse = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${secretKey}&response=${token}`,
        }
      )

      if (!verificationResponse.ok) {
        throw new Error(`reCAPTCHA API returned status: ${verificationResponse.status}`)
      }

      const verificationData = await verificationResponse.json()
      console.log('reCAPTCHA verification result:', verificationData)

      if (verificationData.success) {
        // Score kontrolü (0.5 ve üzeri güvenli kabul edilir)
        const score = verificationData.score || 0.0
        if (score >= 0.3) { // Daha esnek threshold
          return NextResponse.json({ 
            success: true, 
            score: score 
          })
        } else {
          return NextResponse.json({ 
            error: 'Security verification failed', 
            score: score 
          }, { status: 403 })
        }
      } else {
        return NextResponse.json({ 
          error: 'reCAPTCHA verification failed',
          'error-codes': verificationData['error-codes'] || []
        }, { status: 400 })
      }
    } catch (fetchError) {
      console.error('Error calling reCAPTCHA API:', fetchError)
      return NextResponse.json({ error: 'reCAPTCHA verification error' }, { status: 500 })
    }
  } catch (error) {
    console.error('reCAPTCHA API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}