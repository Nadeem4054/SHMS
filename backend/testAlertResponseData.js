const mongoose = require('mongoose');
const AlertResponse = require('./models/AlertResponse');
const User = require('./models/User');
const StudentApplication = require('./models/StudentApplication');

// Test the data structure for alert responses
async function testAlertResponseData() {
  console.log('🧪 Testing Alert Response Data Structure...\n');
  
  try {
    // Test 1: Check if we can find a student and their application
    const student = await User.findOne({ role: 'student' });
    if (student) {
      console.log('✅ Found student:', student.name, student.email);
      
      const application = await StudentApplication.findOne({ 
        email: student.email,
        status: 'approved'
      }).populate('roomId', 'roomNumber floor hostelBlock');
      
      if (application) {
        console.log('✅ Found student application with room:');
        console.log('   Room Number:', application.roomId?.roomNumber || 'Not assigned');
        console.log('   Floor:', application.roomId?.floor || 'Not assigned');
        console.log('   Block:', application.roomId?.hostelBlock || 'Not assigned');
      } else {
        console.log('⚠️ No approved application found for this student');
      }
    } else {
      console.log('⚠️ No student users found in database');
    }
    
    // Test 2: Check alert response structure
    const responses = await AlertResponse.find()
      .populate('studentId', 'name email')
      .limit(1);
    
    if (responses.length > 0) {
      const response = responses[0];
      console.log('\n✅ Sample alert response structure:');
      console.log('   Response ID:', response._id);
      console.log('   Response Type:', response.response);
      console.log('   Student Name:', response.studentId?.name || 'Unknown');
      console.log('   Student Email:', response.studentId?.email || 'Unknown');
      console.log('   Response Time:', response.respondedAt);
    } else {
      console.log('\n⚠️ No alert responses found in database');
    }
    
    console.log('\n🎉 Data structure test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  process.exit(0);
}

testAlertResponseData();
