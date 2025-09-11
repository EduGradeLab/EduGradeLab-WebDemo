import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
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

    // Upload file to Vercel Blob Storage
    let blobUrl: string
    
    try {
      const fileName = `edugradelab/exam_images/${Date.now()}-${file.name}`
      const blob = await put(fileName, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      blobUrl = blob.url
      console.log('File uploaded to Vercel Blob:', blobUrl)
    } catch (blobError) {
      console.error('Blob storage error:', blobError)
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
    }

    // Save to database
    let examImage
    try {
      examImage = await prisma.exam_images.create({
        data: {
          user_id: effectiveUserId,
          image_blob: blobUrl, // Blob URL olarak kaydet
          filename: file.name,
          filetype: file.type,
          status: 'UPLOADED'
        }
      })
    } catch (dbError) {
      console.error('Database error while saving image:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Create OCR job
    let ocrJob
    try {
      ocrJob = await prisma.ocr_jobs.create({
        data: {
          user_id: effectiveUserId,
          exam_image_id: examImage.id,
          status: 'WAITING'
        }
      })
    } catch (dbError) {
      console.error('Database error while creating OCR job:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Webhook'a gönder (WEBHOOK_SCANNER_URL)
    console.log('Sending webhook to scanner service...')
    console.log('Webhook URL:', process.env.WEBHOOK_SCANNER_URL)
    
    try {
      // Sunucunun çalıştığı portu tespit et
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const host = process.env.NODE_ENV === 'production' ? request.headers.get('host') : 'localhost:3000'
      const callbackUrl = `${protocol}://${host}/api/webhook-result`
      
      const webhookPayload = {
        user_id: effectiveUserId,
        file_id: examImage.id,
        jobId: ocrJob.id,
        fileName: file.name,
        fileType: file.type,
        blobUrl: blobUrl, // Blob URL'yi de gönder
        uploadTime: new Date().toISOString(),
        status: 'uploaded',
        callbackUrl: callbackUrl
      }
      
      console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2))
      
      const webhookResponse = await fetch(process.env.WEBHOOK_SCANNER_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      })
      
      console.log('Webhook response status:', webhookResponse.status)
      
      if (webhookResponse.ok) {
        const responseData = await webhookResponse.text()
        console.log('Webhook response:', responseData)
        
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
        
        console.log('n8n response parsed:', {
          job_id: responseJobId,
          status: responseStatus,
          ocr_result_id: responseOcrResultId,
          shouldMatch: responseJobId === ocrJob.id.toString()
        })
        
      } else {
        console.error('Webhook failed with status:', webhookResponse.status)
        const errorText = await webhookResponse.text()
        console.error('Webhook error response:', errorText)
      }
      
    } catch (webhookError) {
      console.error('Scanner webhook error:', webhookError)
      // Don't fail the upload if webhook fails - continue with success response
    }

    return NextResponse.json({
      success: true,
      fileId: examImage.id,
      jobId: ocrJob.id,
      filename: file.name
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}