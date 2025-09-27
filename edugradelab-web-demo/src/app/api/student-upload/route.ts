import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const answerKeyId = formData.get('answerKeyId') as string // Hangi cevap anahtarına ait
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const user = await getUserFromRequest(request)
    
    // Demo için authentication bypass
    const isDemoMode = process.env.NODE_ENV === 'development' || request.url.includes('localhost')
    
    if (!user && !isDemoMode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Demo modunda dummy user oluştur
    const effectiveUserId = user?.id || 1

    // Upload file to Vercel Blob Storage - Student exam images klasörüne
    let blobUrl: string
    
    try {
      const fileName = `edugradelab/student_exam_images/${Date.now()}-${file.name}`
      const blob = await put(fileName, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      blobUrl = blob.url
      console.log('Student exam file uploaded to Vercel Blob:', blobUrl)
      console.log('File path used:', fileName)
    } catch (blobError) {
      console.error('Blob storage error:', blobError)
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
    }

    // Save to student_exam_images table
    let studentExamImage
    try {
      studentExamImage = await prisma.$executeRaw`
        INSERT INTO student_exam_images (user_id, answer_key_id, image_blob, filename, filetype, status)
        VALUES (${effectiveUserId}, ${answerKeyId ? parseInt(answerKeyId) : null}, ${blobUrl}, ${file.name}, ${file.type}, 'UPLOADED')
      `
      
      // Get the inserted record ID
      const insertedRecord = await prisma.$queryRaw<{id: number}[]>`
        SELECT id FROM student_exam_images WHERE image_blob = ${blobUrl} ORDER BY id DESC LIMIT 1
      `
      
      const studentExamImageId = insertedRecord[0].id
      console.log('Student exam image saved to database with ID:', studentExamImageId)
      
      studentExamImage = { id: studentExamImageId }
      
    } catch (dbError) {
      console.error('Database error while saving student exam image:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Create Student OCR job
    let studentOcrJob
    try {
      await prisma.$executeRaw`
        INSERT INTO student_ocr_jobs (user_id, student_exam_image_id, answer_key_id, status)
        VALUES (${effectiveUserId}, ${studentExamImage.id}, ${answerKeyId ? parseInt(answerKeyId) : null}, 'WAITING')
      `
      
      // Get the inserted job ID
      const insertedJob = await prisma.$queryRaw<{id: number}[]>`
        SELECT id FROM student_ocr_jobs WHERE student_exam_image_id = ${studentExamImage.id} ORDER BY id DESC LIMIT 1
      `
      
      const studentOcrJobId = insertedJob[0].id
      console.log('Student OCR job created with ID:', studentOcrJobId)
      
      studentOcrJob = { id: studentOcrJobId }
      
    } catch (dbError) {
      console.error('Database error while creating student OCR job:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Webhook'a gönder (WEBHOOK_STUDENT_EXAM_URL)
    console.log('Sending webhook to student exam scanner service...')
    console.log('Student Webhook URL:', process.env.WEBHOOK_STUDENT_EXAM_URL)
    console.log('All webhook env vars:', {
      WEBHOOK_SCANNER_URL: process.env.WEBHOOK_SCANNER_URL,
      WEBHOOK_STUDENT_EXAM_URL: process.env.WEBHOOK_STUDENT_EXAM_URL
    })
    
    if (!process.env.WEBHOOK_STUDENT_EXAM_URL) {
      console.error('WEBHOOK_STUDENT_EXAM_URL is not defined in environment variables')
      return NextResponse.json({
        success: false,
        error: 'Webhook URL not configured',
        fileId: studentExamImage.id,
        jobId: studentOcrJob.id,
        filename: file.name
      })
    }
    
    try {
      // Sunucunun çalıştığı portu tespit et
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const host = process.env.NODE_ENV === 'production' ? request.headers.get('host') : 'localhost:3000'
      const callbackUrl = `${protocol}://${host}/api/student-webhook-result`
      
      const webhookPayload = {
        user_id: effectiveUserId,
        file_id: studentExamImage.id,
        jobId: studentOcrJob.id,
        answerKeyId: answerKeyId ? parseInt(answerKeyId) : null,
        fileName: file.name,
        fileType: file.type,
        blobUrl: blobUrl,
        uploadTime: new Date().toISOString(),
        status: 'uploaded',
        callbackUrl: callbackUrl
      }
      
      console.log('Student webhook payload:', JSON.stringify(webhookPayload, null, 2))
      
      const webhookResponse = await fetch(process.env.WEBHOOK_STUDENT_EXAM_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      })
      
      console.log('Student webhook response status:', webhookResponse.status)
      
      if (webhookResponse.ok) {
        const responseData = await webhookResponse.text()
        console.log('Student webhook response:', responseData)
        
        // n8n'den gelen response'u parse et (comma separated format)
        const responseData_trimmed = responseData.trim()
        const responseParams: Record<string, string> = {}
        responseData_trimmed.split(',').forEach(pair => {
          const [key, value] = pair.split('=')
          if (key && value) {
            responseParams[key.trim()] = value.trim()
          }
        })
        
        const responseJobId = responseParams['job_id']
        const responseStatus = responseParams['status']
        const responseOcrResultId = responseParams['ocr_result_id']
        
        console.log('Student n8n response parsed:', {
          job_id: responseJobId,
          status: responseStatus,
          ocr_result_id: responseOcrResultId,
          shouldMatch: responseJobId === studentOcrJob.id.toString()
        })
        
        // n8n'den başarılı response alındığında job'ı güncelle
        if (responseStatus === 'done' && responseOcrResultId && responseJobId === studentOcrJob.id.toString()) {
          try {
            await prisma.$executeRaw`
              UPDATE student_ocr_jobs 
              SET status = 'DONE', ocr_result_id = ${parseInt(responseOcrResultId)}, updated_at = NOW() 
              WHERE id = ${studentOcrJob.id}
            `
            console.log('Student OCR job updated successfully with result ID:', responseOcrResultId)
          } catch (updateError) {
            console.error('Error updating student OCR job:', updateError)
          }
        }
        
      } else {
        console.error('Student webhook failed with status:', webhookResponse.status)
        const errorText = await webhookResponse.text()
        console.error('Student webhook error response:', errorText)
      }
      
    } catch (webhookError) {
      console.error('Student scanner webhook error:', webhookError)
      // Don't fail the upload if webhook fails - continue with success response
    }

    return NextResponse.json({
      success: true,
      fileId: studentExamImage.id,
      jobId: studentOcrJob.id,
      answerKeyId: answerKeyId ? parseInt(answerKeyId) : null,
      filename: file.name
    })

  } catch (error) {
    console.error('Student upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}