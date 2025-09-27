import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log('=== STUDENT WEBHOOK RESULT RECEIVED ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    console.log('Raw body:', body)
    console.log('Body length:', body.length)
    console.log('=======================================')
    
    // n8n'den gelen response format: user_id=5,ocr_result_id=17,status=done,job_id=17
    // Comma separated format'ı parse et
    const responseParams: Record<string, string> = {}
    body.trim().split(',').forEach(pair => {
      const [key, value] = pair.split('=')
      if (key && value) {
        responseParams[key.trim()] = value.trim()
      }
    })
    
    const userId = responseParams['user_id']
    const ocrResultId = responseParams['ocr_result_id'] 
    const status = responseParams['status']
    const jobId = responseParams['job_id']
    
    console.log('Parsed student webhook data:', { userId, ocrResultId, status, jobId })
    
    if (!jobId || !ocrResultId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Student OCR job'ını güncelle - OCR result ID'sini de kaydet
    const updatedJob = await prisma.$executeRaw`
      UPDATE student_ocr_jobs 
      SET status = ${status === 'done' ? 'DONE' : 'ERROR'}, 
          ocr_result_id = ${parseInt(ocrResultId)}, 
          updated_at = NOW()
      WHERE id = ${parseInt(jobId)}
    `
    
    console.log('Updated student OCR job:', updatedJob)

    // Student OCR sonuçlarını veritabanından çek
    const ocrResult = await prisma.$queryRaw<{
      id: number,
      student_exam_image_id: number,
      user_id: number,
      answer_key_id: number | null,
      ocr_text: string | null,
      ai_analysis: string | null,
      student_answers: string | null,
      comparison_result: string | null,
      processed_at: Date,
      processing_time_ms: number | null,
      webhook_status: string
    }[]>`
      SELECT * FROM student_ocr_results WHERE id = ${parseInt(ocrResultId)} LIMIT 1
    `
    
    console.log('Student OCR result from database:', ocrResult)
    
    if (ocrResult && ocrResult.length > 0) {
      const result = ocrResult[0]
      console.log('Student OCR processing completed:', {
        id: result.id,
        student_exam_image_id: result.student_exam_image_id,
        user_id: result.user_id,
        answer_key_id: result.answer_key_id,
        ocr_text_length: result.ocr_text?.length || 0,
        ai_analysis_length: result.ai_analysis?.length || 0,
        student_answers_length: result.student_answers?.length || 0,
        comparison_result_length: result.comparison_result?.length || 0,
        processing_time_ms: result.processing_time_ms
      })
    } else {
      console.warn('Student OCR result not found in database for ID:', ocrResultId)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Student webhook result processed successfully',
      jobId: parseInt(jobId),
      ocrResultId: parseInt(ocrResultId),
      status: status
    })

  } catch (error) {
    console.error('Student webhook result processing error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}