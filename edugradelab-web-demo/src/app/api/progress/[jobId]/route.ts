import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ProgressData {
  status: 'waiting' | 'processing' | 'analyzing' | 'completed' | 'error'
  progress: number
  message: string
  timestamp: string
  data?: unknown
}

// For demo purposes, we'll simulate progress updates
// In production, this would check the actual job status
const simulateProgress = (jobId: string): ProgressData => {
  const now = Date.now()
  const jobStart = parseInt(jobId) * 1000 // Simulate different start times
  const elapsed = now - jobStart
  const totalDuration = 10000 // 10 seconds total
  
  let progress = Math.min((elapsed / totalDuration) * 100, 100)
  let status: ProgressData['status'] = 'waiting'
  let message = 'İşlem kuyrukta bekliyor...'
  
  if (elapsed > 1000) {
    status = 'processing'
    message = 'Dosya işleniyor...'
    progress = Math.min(progress, 30)
  }
  
  if (elapsed > 4000) {
    status = 'analyzing'
    message = 'Yapay zeka analizi yapılıyor...'
    progress = Math.min(progress, 70)
  }
  
  if (elapsed > 8000) {
    status = 'completed'
    message = 'Analiz tamamlandı!'
    progress = 100
  }
  
  return {
    status,
    progress: Math.round(progress),
    message,
    timestamp: new Date().toISOString(),
    data: status === 'completed' ? {
      processingTime: elapsed,
      score: Math.floor(Math.random() * 30) + 70,
      confidence: Math.floor(Math.random() * 20) + 80
    } : undefined
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params
    
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

    // Check if job exists in database
    let ocrJob
    try {
      ocrJob = await prisma.ocr_jobs.findUnique({
        where: { id: jobIdInt }
      })
    } catch (dbError) {
      console.error('Database error while fetching OCR job:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!ocrJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Get exam image and OCR result separately since we don't have relations
    let examImage, ocrResult
    try {
      [examImage, ocrResult] = await Promise.all([
        prisma.exam_images.findUnique({
          where: { id: ocrJob.exam_image_id }
        }),
        prisma.ocr_results.findUnique({
          where: { exam_image_id: ocrJob.exam_image_id }
        })
      ])
    } catch (dbError) {
      console.error('Database error while fetching related data:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // For demo, simulate progress
    // In production, you would return the actual job status
    const progressData = simulateProgress(jobId)

    // If job is actually completed in database, return real data
    if (ocrJob.status === 'DONE' && ocrResult) {
      return NextResponse.json({
        status: 'completed',
        progress: 100,
        message: 'Analiz tamamlandı!',
        timestamp: ocrResult.processed_at.toISOString(),
        data: {
          processingTime: ocrResult.processing_time_ms,
          score: Math.floor(Math.random() * 30) + 70, // Mock score
          confidence: Math.floor(Math.random() * 20) + 80,
          ocrText: ocrResult.ocr_text,
          aiAnalysis: ocrResult.ai_analysis
        }
      })
    }

    // If job has error, return error status
    if (ocrJob.status === 'ERROR') {
      return NextResponse.json({
        status: 'error',
        progress: 0,
        message: examImage?.error_message || 'İşlem sırasında hata oluştu',
        timestamp: new Date().toISOString()
      })
    }

    // Return simulated progress for demo
    return NextResponse.json(progressData)

  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// For SSE endpoint, you would implement this differently
// This is a simplified version for the demo
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params
    
    // For SSE, you would set up a different response format
    // This is just a placeholder
    return NextResponse.json({ 
      message: 'SSE endpoint would be implemented here',
      jobId 
    })
  } catch (error) {
    console.error('SSE endpoint error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}