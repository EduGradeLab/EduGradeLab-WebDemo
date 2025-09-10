import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

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
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to database
    const examImage = await prisma.exam_images.create({
      data: {
        user_id: user.id,
        image_blob: buffer,
        filename: file.name,
        filetype: file.type,
        status: 'UPLOADED'
      }
    })

    // Create OCR job
    const ocrJob = await prisma.ocr_jobs.create({
      data: {
        user_id: user.id,
        exam_image_id: examImage.id,
        status: 'WAITING'
      }
    })

    // TODO: Send to scanner webhook
    // This is where you would send the file to your scanner service
    try {
      await fetch(process.env.WEBHOOK_SCANNER_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: ocrJob.id,
          fileId: examImage.id,
          fileName: file.name,
          fileType: file.type,
          userId: user.id
        })
      })
    } catch (webhookError) {
      console.error('Scanner webhook error:', webhookError)
      // Don't fail the upload if webhook fails
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