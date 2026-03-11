// Test script to verify email configuration
require('dotenv').config();

const { sendApprovalEmail, testEmailConfig } = require('./config/emailService');

const testEmail = async () => {
  console.log('🧪 Testing Email Configuration...\n');
  
  // First test the configuration
  const configOk = await testEmailConfig();
  
  if (!configOk) {
    console.error('❌ Email configuration test failed');
    process.exit(1);
  }
  
  console.log('\n📧 Attempting to send test email...');
  console.log('From:', process.env.EMAIL_USER);
  console.log('To: test@example.com\n');
  
  try {
    const result = await sendApprovalEmail(
      'test@example.com',
      'Test Student',
      '101'
    );
    console.log('\n✅ Test completed successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
};

testEmail();
