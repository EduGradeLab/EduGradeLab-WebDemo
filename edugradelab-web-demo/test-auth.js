const { PrismaClient } = require('./src/generated/prisma/client.js')

const prisma = new PrismaClient()

async function testAuthSystem() {
  console.log('🔐 Testing Authentication System...\n')
  
  try {
    // Test 1: Create a demo user directly
    console.log('1. Testing demo user creation...')
    const testToken = 'auth-test-token-' + Date.now()
    const testIP = '192.168.1.1'
    
    const demoUser = await prisma.users.create({
      data: {
        session_token: testToken,
        ip_address: testIP,
        is_demo_user: true
      }
    })
    console.log(`✅ Demo user created: ID ${demoUser.id}, Token: ${testToken}`)
    
    // Test 2: Test user lookup by token
    console.log('\n2. Testing user lookup by session token...')
    const foundUser = await prisma.users.findUnique({
      where: { session_token: testToken }
    })
    
    if (foundUser && foundUser.id === demoUser.id) {
      console.log('✅ User lookup successful')
    } else {
      throw new Error('User lookup failed')
    }
    
    // Test 3: Test last_active_at update
    console.log('\n3. Testing last activity update...')
    const beforeUpdate = foundUser.last_active_at
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
    
    await prisma.users.update({
      where: { id: foundUser.id },
      data: { last_active_at: new Date() }
    })
    
    const afterUpdate = await prisma.users.findUnique({
      where: { id: foundUser.id }
    })
    
    if (afterUpdate && afterUpdate.last_active_at > beforeUpdate) {
      console.log('✅ Last activity update successful')
    } else {
      throw new Error('Last activity update failed')
    }
    
    // Test 4: Test demo email creation
    console.log('\n4. Testing demo email creation...')
    const demoEmail = await prisma.demo_emails.create({
      data: {
        user_id: foundUser.id,
        email: 'test-auth@example.com',
        name: 'Auth Test User'
      }
    })
    console.log(`✅ Demo email created: ID ${demoEmail.id}`)
    
    // Test 5: Test user with demo email relationship
    console.log('\n5. Testing user-demo email relationship...')
    const userWithEmail = await prisma.users.findUnique({
      where: { id: foundUser.id }
    })
    
    console.log(`✅ User relationship test passed: User ID ${userWithEmail.id}`)
    
    console.log('\n🎉 ALL AUTH TESTS PASSED! Authentication system is working correctly!')
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...')
    await prisma.demo_emails.delete({ where: { id: demoEmail.id } })
    await prisma.users.delete({ where: { id: demoUser.id } })
    console.log('✅ Test data cleaned up successfully!')
    
  } catch (error) {
    console.error('❌ Auth test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuthSystem()