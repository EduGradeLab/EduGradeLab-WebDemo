import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log('=== WEBHOOK RESULT RECEIVED ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    console.log('Raw body:', body)
    console.log('Body length:', body.length)
    console.log('===============================')
    
    // n8n'den gelen response format: user_id=5,ocr_result_id=17,status=done,job_id=17
    const params = new URLSearchParams(body)
    const userId = params.get('user_id')
    const ocrResultId = params.get('ocr_result_id') 
    const status = params.get('status')
    const jobId = params.get('job_id')
    
    console.log('Parsed webhook data:', { userId, ocrResultId, status, jobId })
    
    if (!jobId || !ocrResultId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // OCR job'ını güncelle - OCR result ID'sini de kaydet
    const updatedJob = await prisma.ocr_jobs.update({
      where: { id: parseInt(jobId) },
      data: { 
        status: status === 'done' ? 'DONE' : 'ERROR',
        ocr_result_id: parseInt(ocrResultId), // OCR result ID'sini kaydet
        updated_at: new Date()
      }
    })
    
    console.log('Updated OCR job:', updatedJob)

    // OCR sonuçlarını veritabanından çek
    // ocr_result_id = ocr_results tablosundaki id field'ı
    const ocrResult = await prisma.ocr_results.findUnique({
      where: { id: parseInt(ocrResultId) }
    })
    
    if (ocrResult) {
      console.log('OCR Result found:', {
        id: ocrResult.id,
        exam_image_id: ocrResult.exam_image_id,
        ocr_text_length: ocrResult.ocr_text?.length || 0,
        feedback_length: ocrResult.feedback?.length || 0
      })
    } else {
      console.log('No OCR result found for exam_image_id:', ocrResultId)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      jobId: jobId,
      ocrResultId: ocrResultId,
      status: status,
      ocrResult: ocrResult
    })

  } catch (error) {
    console.error('Webhook result error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}// GET method için de endpoint ekleyelim (test amaçlı)
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
