const { PrismaClient } = require('./src/generated/prisma/client.js')

const prisma = new PrismaClient()

async function testDatabase() {
  console.log('🔍 Testing Database Connection and Tables...\n')
  
  try {
    // Test database connection
    console.log('1. Testing database connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful!\n')
    
    // Test users table
    console.log('2. Testing users table...')
    const userCount = await prisma.users.count()
    console.log(`✅ Users table exists, contains ${userCount} records\n`)
    
    // Test exam_images table
    console.log('3. Testing exam_images table...')
    const imageCount = await prisma.exam_images.count()
    console.log(`✅ Exam_images table exists, contains ${imageCount} records\n`)
    
    // Test ocr_jobs table
    console.log('4. Testing ocr_jobs table...')
    const jobCount = await prisma.ocr_jobs.count()
    console.log(`✅ OCR_jobs table exists, contains ${jobCount} records\n`)
    
    // Test ocr_results table
    console.log('5. Testing ocr_results table...')
    const resultCount = await prisma.ocr_results.count()
    console.log(`✅ OCR_results table exists, contains ${resultCount} records\n`)
    
    // Test job_logs table
    console.log('6. Testing job_logs table...')
    const logCount = await prisma.job_logs.count()
    console.log(`✅ Job_logs table exists, contains ${logCount} records\n`)
    
    // Test demo_emails table
    console.log('7. Testing demo_emails table...')
    const emailCount = await prisma.demo_emails.count()
    console.log(`✅ Demo_emails table exists, contains ${emailCount} records\n`)
    
    // Test creating a demo user
    console.log('8. Testing demo user creation...')
    const testToken = 'test-token-' + Date.now()
    const testUser = await prisma.users.create({
      data: {
        session_token: testToken,
        ip_address: '127.0.0.1',
        is_demo_user: true
      }
    })
    console.log(`✅ Demo user created successfully with ID: ${testUser.id}\n`)
    
    // Test creating related records
    console.log('9. Testing related record creation...')
    
    // Create exam image
    const examImage = await prisma.exam_images.create({
      data: {
        user_id: testUser.id,
        image_blob: Buffer.from('test image data'),
        filename: 'test.jpg',
        filetype: 'image/jpeg',
        status: 'UPLOADED'
      }
    })
    console.log(`✅ Exam image created with ID: ${examImage.id}`)
    
    // Create OCR job
    const ocrJob = await prisma.ocr_jobs.create({
      data: {
        user_id: testUser.id,
        exam_image_id: examImage.id,
        status: 'Wyapay zekaTING'
      }
    })
    console.log(`✅ OCR job created with ID: ${ocrJob.id}`)
    
    // Create OCR result
    const ocrResult = await prisma.ocr_results.create({
      data: {
        exam_image_id: examImage.id,
        user_id: testUser.id,
        ocr_text: 'Test OCR text',
        ai_analysis: 'Test yapay zeka analysis',
        webhook_status: 'SUCCESS'
      }
    })
    console.log(`✅ OCR result created with ID: ${ocrResult.id}`)
    
    // Create job log
    const jobLog = await prisma.job_logs.create({
      data: {
        ocr_job_id: ocrJob.id,
        event_type: 'test_event',
        log_message: 'Test log message'
      }
    })
    console.log(`✅ Job log created with ID: ${jobLog.id}`)
    
    // Create demo email
    const demoEmail = await prisma.demo_emails.create({
      data: {
        user_id: testUser.id,
        email: 'test@example.com',
        name: 'Test User'
      }
    })
    console.log(`✅ Demo email created with ID: ${demoEmail.id}\n`)
    
    // Test querying relationships
    console.log('10. Testing relationship queries...')
    const userWithRelations = await prisma.users.findUnique({
      where: { id: testUser.id }
    })
    console.log(`✅ User query successful: ${userWithRelations?.session_token}`)
    
    console.log('\n🎉 ALL TESTS PASSED! Database is working correctly!')
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...')
    await prisma.demo_emails.delete({ where: { id: demoEmail.id } })
    await prisma.job_logs.delete({ where: { id: jobLog.id } })
    await prisma.ocr_results.delete({ where: { id: ocrResult.id } })
    await prisma.ocr_jobs.delete({ where: { id: ocrJob.id } })
    await prisma.exam_images.delete({ where: { id: examImage.id } })
    await prisma.users.delete({ where: { id: testUser.id } })
    console.log('✅ Test data cleaned up successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()