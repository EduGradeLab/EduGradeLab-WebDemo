import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    const nodeEnv = process.env.NODE_ENV
    
    return NextResponse.json({
      success: true,
      environment: nodeEnv,
      siteKey: siteKey ? siteKey.substring(0, 10) + '...' : 'NOT SET',
      secretKey: secretKey ? secretKey.substring(0, 10) + '...' : 'NOT SET',
      keys_configured: !!(siteKey && secretKey),
      recaptcha_url: `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    })
  } catch (error) {
    console.error('Test reCAPTCHA error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
