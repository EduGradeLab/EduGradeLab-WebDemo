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
    
    if (!secretKey) {
      console.error('reCAPTCHA secret key not configured')
      return NextResponse.json({ error: 'reCAPTCHA not configured' }, { status: 500 })
    }

    console.log('Processing reCAPTCHA verification...')
    if (!isProduction) {
      console.log('Environment: development')
      console.log('Token received:', token.substring(0, 20) + '...')
    }

    // Development fallback token kontrolü
    if (!isProduction && token.startsWith('dev-')) {
      console.log('Development fallback token detected, bypassing reCAPTCHA verification')
      return NextResponse.json({ 
        success: true, 
        score: 0.9,
        environment: 'development',
        fallback: true
      })
    }

    // reCAPTCHA v3 verification
    try {
      console.log('Calling Google reCAPTCHA API...')
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
      if (!isProduction) {
        console.log('reCAPTCHA verification result:', verificationData)
      }

      if (verificationData.success) {
        // Score kontrolü (ortam tabanlı threshold)
        const score = verificationData.score || 0.0
        const threshold = isProduction ? 0.5 : 0.3 // Production'da daha yüksek threshold
        
        if (!isProduction) {
          console.log(`reCAPTCHA score: ${score}, threshold: ${threshold}`)
        }
        
        if (score >= threshold) {
          return NextResponse.json({ 
            success: true, 
            score: score,
            environment: isProduction ? 'production' : 'development'
          })
        } else {
          return NextResponse.json({ 
            error: 'Güvenlik skoru çok düşük. Lütfen tekrar deneyin.', 
            score: score,
            threshold: threshold
          }, { status: 403 })
        }
      } else {
        console.error('reCAPTCHA verification failed:', verificationData['error-codes'])
        return NextResponse.json({ 
          error: 'Bot koruması başarısız. Lütfen sayfayı yenileyin.',
          'error-codes': verificationData['error-codes'] || []
        }, { status: 400 })
      }
    } catch (fetchError) {
      console.error('Error calling reCAPTCHA API:', fetchError)
      return NextResponse.json({ error: 'Güvenlik doğrulaması sırasında hata oluştu' }, { status: 500 })
    }
  } catch (error) {
    console.error('reCAPTCHA API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}