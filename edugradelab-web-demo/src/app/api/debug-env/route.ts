import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    WEBHOOK_SCANNER_URL: process.env.WEBHOOK_SCANNER_URL || 'undefined',
    WEBHOOK_STUDENT_EXAM_URL: process.env.WEBHOOK_STUDENT_EXAM_URL || 'undefined',
    NODE_ENV: process.env.NODE_ENV || 'undefined',
    envExists: {
      WEBHOOK_SCANNER_URL: !!process.env.WEBHOOK_SCANNER_URL,
      WEBHOOK_STUDENT_EXAM_URL: !!process.env.WEBHOOK_STUDENT_EXAM_URL,
    }
  });
}