import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUserFromRequest } from '../../../lib/auth'

export async function GET(request: Request) {
  try {
    // Get user from request for authentication
    const user = await getUserFromRequest(request as NextRequest)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(10, Math.max(1, parseInt(searchParams.get('limit') || '5', 10)))

    // Get recent job logs by joining with ocr_jobs for user filtering
    const recentJobLogs = await prisma.$queryRaw`
      SELECT 
        jl.id,
        jl.ocr_job_id,
        jl.event_type,
        jl.log_message,
        jl.created_at,
        oj.id as ocr_job_id,
        oj.user_id,
        oj.exam_image_id,
        oj.status as job_status,
        ei.filename,
        ei.upload_time,
        ei.status as image_status,
        or_.ocr_text,
        or_.ai_analysis,
        or_.processed_at
      FROM job_logs jl
      JOIN ocr_jobs oj ON jl.ocr_job_id = oj.id
      LEFT JOIN exam_images ei ON oj.exam_image_id = ei.id
      LEFT JOIN ocr_results or_ ON oj.exam_image_id = or_.exam_image_id
      WHERE oj.user_id = ${user.id}
      ORDER BY jl.created_at DESC
      LIMIT ${limit}
    ` as any[]

    if (!recentJobLogs.length) {
      return NextResponse.json({ 
        message: 'No recent operations found',
        data: [],
        total: 0
      })
    }

    // Transform job logs to display format
    const operations = recentJobLogs.map(log => {
      const score = log.ai_analysis
        ? JSON.parse(log.ai_analysis).score || null
        : null

      return {
        id: log.id,
        jobId: log.ocr_job_id,
        filename: log.filename || 'Unknown Document',
        operation: log.log_message || log.event_type,
        level: log.event_type,
        status: log.job_status || 'UNKNOWN',
        score: score,
        createdAt: log.created_at,
        documentId: log.exam_image_id || null,
        ocrText: log.ocr_text || null,
        aiAnalysis: log.ai_analysis || null
      }
    })

    return NextResponse.json({
      message: 'Recent operations fetched successfully',
      data: operations,
      total: operations.length
    })
  } catch (error) {
    console.error('Database error in recent-results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}