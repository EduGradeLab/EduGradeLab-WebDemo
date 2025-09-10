import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent results for the user
    const recentResults = await prisma.exam_images.findMany({
      where: {
        user_id: user.id
      },
      orderBy: {
        upload_time: 'desc'
      },
      take: 10 // Last 10 results
    })

    // Get OCR results for each document separately
    const documentIds = recentResults.map(doc => doc.id)
    const ocrResults = await prisma.ocr_results.findMany({
      where: {
        exam_image_id: {
          in: documentIds
        }
      }
    })

    const formattedResults = recentResults.map((result) => {
      const ocrResult = ocrResults.find(r => r.exam_image_id === result.id)
      return {
        id: result.id.toString(),
        filename: result.filename,
        uploadTime: result.upload_time.toISOString(),
        status: result.status,
        ocrText: ocrResult?.ocr_text,
        aiAnalysis: ocrResult?.ai_analysis,
        score: ocrResult?.ai_analysis 
          ? Math.floor(Math.random() * 30) + 70 // Mock score for demo
          : undefined
      }
    })

    return NextResponse.json({
      success: true,
      results: formattedResults
    })

  } catch (error) {
    console.error('Recent results error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}