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
    const isProduction = process.env.NODE_ENV === 'production'
    const isTestKey = secretKey === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
    
    if (!secretKey) {
      console.error('reCAPTCHA secret key not configured')
      return NextResponse.json({ error: 'reCAPTCHA not configured' }, { status: 500 })
    }

    // Development/localhost için test key kontrolü
    if (!isProduction && isTestKey) {
      console.log('Development mode: using test reCAPTCHA key')
      
      // Test fallback token kontrolü
      if (token.startsWith('test-fallback-token-')) {
        console.log('Test fallback token detected, bypassing reCAPTCHA verification')
        return NextResponse.json({ 
          success: true, 
          score: 0.9,
          environment: 'development',
          fallback: true
        })
      }
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
        // Score kontrolü (ortam tabanlı threshold)
        const score = verificationData.score || 0.0
        const threshold = (!isProduction && isTestKey) ? 0.1 : 0.3 // Test key için daha düşük threshold
        
        console.log(`reCAPTCHA score: ${score}, threshold: ${threshold}, isProduction: ${isProduction}`)
        
        if (score >= threshold) {
          return NextResponse.json({ 
            success: true, 
            score: score,
            environment: isProduction ? 'production' : 'development'
          })
        } else {
          return NextResponse.json({ 
            error: 'Security verification failed', 
            score: score,
            threshold: threshold
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