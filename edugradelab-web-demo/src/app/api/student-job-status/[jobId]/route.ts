import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId: jobIdParam } = await params
    const jobId = parseInt(jobIdParam)
    
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    // Student job durumunu kontrol et
    const studentOcrJob = await prisma.$queryRaw<{
      id: number,
      user_id: number,
      student_exam_image_id: number,
      answer_key_id: number | null,
      status: string,
      webhook_id: string | null,
      ocr_result_id: number | null,
      created_at: Date,
      updated_at: Date
    }[]>`
      SELECT * FROM student_ocr_jobs WHERE id = ${jobId} LIMIT 1
    `

    if (!studentOcrJob || studentOcrJob.length === 0) {
      return NextResponse.json({ error: 'Student job not found' }, { status: 404 })
    }

    const job = studentOcrJob[0]
    let result = null
    
    // Eğer job tamamlandıysa student OCR sonucunu getir
    if (job.status === 'DONE' && job.ocr_result_id) {
      const studentOcrResult = await prisma.$queryRaw<{
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
        webhook_status: string,
        webhook_response: string | null,
        feedback: string | null
      }[]>`
        SELECT * FROM student_ocr_results WHERE id = ${job.ocr_result_id} LIMIT 1
      `
      
      if (studentOcrResult && studentOcrResult.length > 0) {
        result = studentOcrResult[0]
        console.log('Student OCR result fetched for job', jobId, ':', `Found (ID: ${result.id})`)
      } else {
        console.log('Student OCR result not found for result ID:', job.ocr_result_id)
      }
      
      console.log('Student OCR job details:', {
        id: job.id,
        status: job.status,
        ocr_result_id: job.ocr_result_id,
        student_exam_image_id: job.student_exam_image_id,
        answer_key_id: job.answer_key_id
      })
    } else {
      console.log('Student OCR job not ready for result fetch:', {
        id: job.id,
        status: job.status,
        ocr_result_id: job.ocr_result_id
      })
    }

    // Student exam image bilgilerini de getir
    const studentExamImage = await prisma.$queryRaw<{
      id: number,
      user_id: number,
      answer_key_id: number | null,
      image_blob: string,
      filename: string,
      filetype: string,
      upload_time: Date,
      status: string,
      ocr_result_id: number | null,
      error_message: string | null
    }[]>`
      SELECT * FROM student_exam_images WHERE id = ${job.student_exam_image_id} LIMIT 1
    `

    const examImage = studentExamImage && studentExamImage.length > 0 ? studentExamImage[0] : null

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        answer_key_id: job.answer_key_id,
        created_at: job.created_at,
        updated_at: job.updated_at
      },
      studentExamImage: examImage ? {
        id: examImage.id,
        filename: examImage.filename,
        status: examImage.status,
        answer_key_id: examImage.answer_key_id,
        error_message: examImage.error_message
      } : null,
      result: result ? {
        id: result.id,
        ocr_text: result.ocr_text,
        ai_analysis: result.ai_analysis,
        student_answers: result.student_answers,
        comparison_result: result.comparison_result,
        processing_time_ms: result.processing_time_ms,
        processed_at: result.processed_at,
        answer_key_id: result.answer_key_id
      } : null
    })

  } catch (error) {
    console.error('Student job status check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}