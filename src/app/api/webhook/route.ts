import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Webhook endpoint for receiving OCR results from n8n
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook received:', body)

    // Validate webhook payload
    const { jobId, status, ocrText, aiAnalysis, processingTimeMs, error } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Find the OCR job
    const ocrJob = await prisma.ocr_jobs.findUnique({
      where: { id: parseInt(jobId) }
    })

    if (!ocrJob) {
      return NextResponse.json({ error: 'OCR job not found' }, { status: 404 })
    }

    // Update job status
    await prisma.ocr_jobs.update({
      where: { id: parseInt(jobId) },
      data: {
        status: status === 'error' ? 'ERROR' : 'DONE',
        updated_at: new Date()
      }
    })

    // Update exam image status
    await prisma.exam_images.update({
      where: { id: ocrJob.exam_image_id },
      data: {
        status: status === 'error' ? 'ERROR' : 'PROCESSED',
        error_message: error || null
      }
    })

    // Create or update OCR result
    if (status !== 'error' && ocrText) {
      await prisma.ocr_results.upsert({
        where: {
          exam_image_id: ocrJob.exam_image_id
        },
        update: {
          ocr_text: ocrText,
          ai_analysis: aiAnalysis || null,
          processed_at: new Date(),
          processing_time_ms: processingTimeMs || null,
          webhook_status: 'SUCCESS'
        },
        create: {
          exam_image_id: ocrJob.exam_image_id,
          user_id: ocrJob.user_id,
          ocr_text: ocrText,
          ai_analysis: aiAnalysis || null,
          processed_at: new Date(),
          processing_time_ms: processingTimeMs || null,
          webhook_status: 'SUCCESS'
        }
      })

      // Update exam image with OCR result reference
      const ocrResult = await prisma.ocr_results.findFirst({
        where: { exam_image_id: ocrJob.exam_image_id }
      })
      
      if (ocrResult) {
        await prisma.exam_images.update({
          where: { id: ocrJob.exam_image_id },
          data: {
            ocr_result_id: ocrResult.id
          }
        })
      }
    }

    // Log the webhook event
    await prisma.job_logs.create({
      data: {
        ocr_job_id: parseInt(jobId),
        event_type: 'webhook_received',
        log_message: JSON.stringify({
          status,
          processingTimeMs,
          hasOcrText: !!ocrText,
          hasAiAnalysis: !!aiAnalysis,
          error: error || null
        })
      }
    })

    // If AI analysis is not complete, forward to AI webhook
    if (ocrText && !aiAnalysis && status !== 'error') {
      try {
        const aiResponse = await fetch(process.env.WEBHOOK_AI_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            ocrText,
            fileId: ocrJob.exam_image_id,
            userId: ocrJob.user_id
          })
        })

        if (aiResponse.ok) {
          await prisma.job_logs.create({
            data: {
              ocr_job_id: parseInt(jobId),
              event_type: 'ai_webhook_sent',
              log_message: 'AI analysis request sent successfully'
            }
          })
        }
      } catch (aiError) {
        console.error('AI webhook error:', aiError)
        await prisma.job_logs.create({
          data: {
            ocr_job_id: parseInt(jobId),
            event_type: 'ai_webhook_error',
            log_message: `Failed to send to AI webhook: ${aiError}`
          }
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    // Try to log the error if we have a job ID
    try {
      const { jobId } = await request.json()
      if (jobId) {
        await prisma.job_logs.create({
          data: {
            ocr_job_id: parseInt(jobId),
            event_type: 'webhook_error',
            log_message: `Webhook processing error: ${error}`
          }
        })
      }
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Handle webhook verification (GET request)
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'webhook_endpoint_active',
    message: 'EduGradeLab webhook endpoint is running'
  })
}