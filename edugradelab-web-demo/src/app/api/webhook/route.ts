import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Webhook endpoint for receiving OCR results from n8n
export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Invalid JSON in webhook request:', parseError)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }
    
    console.log('Webhook received:', body)

    // Validate webhook payload
    const { jobId, status, ocrText, aiAnalysis, processingTimeMs, error } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    let jobIdInt
    try {
      jobIdInt = parseInt(jobId)
      if (isNaN(jobIdInt)) {
        return NextResponse.json({ error: 'Invalid job ID format' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    // Find the OCR job
    let ocrJob
    try {
      ocrJob = await prisma.ocr_jobs.findUnique({
        where: { id: jobIdInt }
      })
    } catch (dbError) {
      console.error('Database error while finding OCR job:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!ocrJob) {
      return NextResponse.json({ error: 'OCR job not found' }, { status: 404 })
    }

    // Update job status
    try {
      await prisma.ocr_jobs.update({
        where: { id: jobIdInt },
        data: {
          status: status === 'error' ? 'ERROR' : 'DONE',
          updated_at: new Date()
        }
      })
    } catch (dbError) {
      console.error('Database error while updating OCR job:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Update exam image status
    try {
      await prisma.exam_images.update({
        where: { id: ocrJob.exam_image_id },
        data: {
          status: status === 'error' ? 'ERROR' : 'PROCESSED',
          error_message: error || null
        }
      })
    } catch (dbError) {
      console.error('Database error while updating exam image:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Create or update OCR result
    if (status !== 'error' && ocrText) {
      try {
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
        try {
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
        } catch (updateError) {
          console.error('Error updating exam image with OCR result reference:', updateError)
          // Continue without failing the webhook
        }
      } catch (dbError) {
        console.error('Database error while creating/updating OCR result:', dbError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }
    }

    // Log the webhook event
    try {
      await prisma.job_logs.create({
        data: {
          ocr_job_id: jobIdInt,
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
    } catch (dbError) {
      console.error('Database error while creating job log:', dbError)
      // Continue without failing the webhook
    }

    // If yapay zeka analysis is not complete, forward to yapay zeka webhook
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
          try {
            await prisma.job_logs.create({
              data: {
                ocr_job_id: jobIdInt,
                event_type: 'ai_webhook_sent',
                log_message: 'yapay zeka analysis request sent successfully'
              }
            })
          } catch (logError) {
            console.error('Error logging yapay zeka webhook success:', logError)
          }
        }
      } catch (aiError) {
        console.error('yapay zeka webhook error:', aiError)
        try {
          await prisma.job_logs.create({
            data: {
              ocr_job_id: jobIdInt,
              event_type: 'ai_webhook_error',
              log_message: `Failed to send to yapay zeka webhook: ${aiError}`
            }
          })
        } catch (logError) {
          console.error('Error logging yapay zeka webhook error:', logError)
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Handle webhook verification (GET request)
export async function GET() {
  return NextResponse.json({ 
    status: 'webhook_endpoint_active',
    message: 'EduGradeLab webhook endpoint is running'
  })
}
