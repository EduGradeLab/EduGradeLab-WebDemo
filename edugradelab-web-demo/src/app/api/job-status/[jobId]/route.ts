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

    // Job durumunu kontrol et
    const ocrJob = await prisma.ocr_jobs.findUnique({
      where: { id: jobId }
    })

    if (!ocrJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    let result = null
    
    // Eğer job tamamlandıysa OCR sonucunu getir
    if (ocrJob.status === 'DONE' && ocrJob.ocr_result_id) {
      result = await prisma.ocr_results.findUnique({
        where: { id: ocrJob.ocr_result_id }
      })
      console.log('OCR result fetched for job', jobId, ':', result ? `Found (ID: ${result.id})` : 'Not found')
      console.log('OCR job details:', {
        id: ocrJob.id,
        status: ocrJob.status,
        ocr_result_id: ocrJob.ocr_result_id,
        exam_image_id: ocrJob.exam_image_id
      })
    } else {
      console.log('OCR job not ready for result fetch:', {
        id: ocrJob.id,
        status: ocrJob.status,
        ocr_result_id: ocrJob.ocr_result_id
      })
    }

    // Exam image bilgilerini de getir
    const examImage = await prisma.exam_images.findUnique({
      where: { id: ocrJob.exam_image_id }
    })

    return NextResponse.json({
      success: true,
      job: {
        id: ocrJob.id,
        status: ocrJob.status,
        created_at: ocrJob.created_at,
        updated_at: ocrJob.updated_at
      },
      examImage: {
        id: examImage?.id,
        filename: examImage?.filename,
        status: examImage?.status,
        error_message: examImage?.error_message
      },
      result: result ? {
        id: result.id,
        ocr_text: result.ocr_text,
        ai_analysis: result.ai_analysis,
        processing_time_ms: result.processing_time_ms,
        processed_at: result.processed_at
      } : null
    })

  } catch (error) {
    console.error('Job status check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
