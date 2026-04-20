// Test alert stats calculation with ObjectId comparison
const mongoose = require('mongoose');
const Alert = require('./models/Alert');
const AlertResponse = require('./models/AlertResponse');
const StudentApplication = require('./models/StudentApplication');

async function testAlertStats() {
  console.log('🧪 Testing Alert Stats Calculation...\n');
  
  try {
    // 1. Find an active alert
    const activeAlert = await Alert.findOne({ isActive: true });
    if (!activeAlert) {
      console.log('❌ No active alert found for testing');
      process.exit(0);
    }
    
    console.log(`✅ Found active alert: ${activeAlert._id} (type: ${typeof activeAlert._id})`);
    console.log(`   Message: ${activeAlert.message}`);
    console.log(`   Type: ${activeAlert.type}`);
    
    // 2. Test string vs ObjectId comparison
    const alertIdString = activeAlert._id.toString();
    const alertObjectId = new mongoose.Types.ObjectId(alertIdString);
    
    console.log(`\n🔍 Testing ObjectId conversion:`);
    console.log(`   String: ${alertIdString} (type: ${typeof alertIdString})`);
    console.log(`   ObjectId: ${alertObjectId} (type: ${typeof alertObjectId})`);
    
    // 3. Test different query methods
    console.log(`\n📊 Testing query methods:`);
    
    // Method 1: Using string (might not work)
    const responsesWithString = await AlertResponse.find({ alertId: alertIdString });
    console.log(`   Query with string: ${responsesWithString.length} responses`);
    
    // Method 2: Using ObjectId (should work)
    const responsesWithObjectId = await AlertResponse.find({ alertId: alertObjectId });
    console.log(`   Query with ObjectId: ${responsesWithObjectId.length} responses`);
    
    // Method 3: Using original ObjectId (should work)
    const responsesWithOriginalId = await AlertResponse.find({ alertId: activeAlert._id });
    console.log(`   Query with original ObjectId: ${responsesWithOriginalId.length} responses`);
    
    // 4. Show actual responses
    if (responsesWithObjectId.length > 0) {
      console.log(`\n📋 Found responses:`);
      responsesWithObjectId.forEach((response, index) => {
        console.log(`   ${index + 1}. Student: ${response.studentId}`);
        console.log(`      Response: ${response.response}`);
        console.log(`      Alert ID: ${response.alertId}`);
        console.log(`      Responded at: ${response.respondedAt}`);
      });
      
      // 5. Test counting
      const safeCount = responsesWithObjectId.filter(r => r.response === 'safe').length;
      const sosCount = responsesWithObjectId.filter(r => r.response === 'sos').length;
      const totalStudents = await StudentApplication.countDocuments({ status: 'approved' });
      const responseRate = totalStudents > 0 ? Math.round(((safeCount + sosCount) / totalStudents) * 100) : 0;
      
      console.log(`\n📈 Calculated stats:`);
      console.log(`   Total approved students: ${totalStudents}`);
      console.log(`   Safe responses: ${safeCount}`);
      console.log(`   SOS responses: ${sosCount}`);
      console.log(`   Response rate: ${responseRate}%`);
      
    } else {
      console.log(`\n⚠️ No responses found for this alert`);
      console.log(`   This might be why stats show 0`);
      
      // Check if there are any responses at all
      const allResponses = await AlertResponse.find({});
      console.log(`   Total responses in database: ${allResponses.length}`);
      
      if (allResponses.length > 0) {
        console.log(`   Sample response alert IDs:`);
        allResponses.slice(0, 3).forEach((r, i) => {
          console.log(`     ${i + 1}. ${r.alertId} (response: ${r.response})`);
        });
      }
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  process.exit(0);
}

testAlertStats();
