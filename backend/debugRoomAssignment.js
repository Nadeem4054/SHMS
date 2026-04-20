const mongoose = require('mongoose');
const AlertResponse = require('./models/AlertResponse');
const User = require('./models/User');
const StudentApplication = require('./models/StudentApplication');

// Test the actual data to debug room assignment issue
async function debugRoomAssignment() {
  console.log('🔍 Debugging Room Assignment Issue...\n');
  
  try {
    // 1. Find all students
    const students = await User.find({ role: 'student' });
    console.log(`Found ${students.length} students:`);
    students.forEach(student => {
      console.log(`  - ${student.name} (${student.email})`);
    });
    
    // 2. Find all approved applications
    const applications = await StudentApplication.find({ status: 'approved' })
      .populate('roomId', 'roomNumber floor hostelBlock');
    
    console.log(`\nFound ${applications.length} approved applications:`);
    applications.forEach(app => {
      console.log(`  - ${app.name} (${app.email}) -> Room: ${app.roomId?.roomNumber || 'Not assigned'}`);
    });
    
    // 3. Find alert responses and check room lookup
    const responses = await AlertResponse.find()
      .populate('studentId', 'name email')
      .limit(3);
    
    console.log(`\nTesting room lookup for ${responses.length} alert responses:`);
    
    for (const response of responses) {
      console.log(`\n🔍 Student: ${response.studentId.name} (${response.studentId.email})`);
      
      const studentApplication = await StudentApplication.findOne({
        email: response.studentId.email,
        status: 'approved'
      }).populate('roomId', 'roomNumber floor hostelBlock');
      
      if (studentApplication) {
        console.log(`   ✅ Found application: ${studentApplication.name}`);
        console.log(`   📍 Room: ${studentApplication.roomId?.roomNumber || 'Not assigned'}`);
        console.log(`   🏢 Floor: ${studentApplication.roomId?.floor || 'Not assigned'}`);
        console.log(`   🏘️ Block: ${studentApplication.roomId?.hostelBlock || 'Not assigned'}`);
      } else {
        console.log(`   ❌ No approved application found for this student`);
        
        // Check if there's any application (not just approved)
        const anyApplication = await StudentApplication.findOne({
          email: response.studentId.email
        }).populate('roomId', 'roomNumber floor hostelBlock');
        
        if (anyApplication) {
          console.log(`   ⚠️ Found application with status: ${anyApplication.status}`);
          console.log(`   📍 Room: ${anyApplication.roomId?.roomNumber || 'Not assigned'}`);
        } else {
          console.log(`   ❌ No application found at all for this student`);
        }
      }
    }
    
    console.log('\n🎉 Debug completed!');
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
  
  process.exit(0);
}

debugRoomAssignment();
