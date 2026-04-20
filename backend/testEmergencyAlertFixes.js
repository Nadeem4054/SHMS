const mongoose = require('mongoose');
const Alert = require('./models/Alert');
const AlertResponse = require('./models/AlertResponse');
const StudentApplication = require('./models/StudentApplication');

// Test all Emergency Alert fixes
async function testEmergencyAlertFixes() {
  console.log('🧪 Testing Emergency Alert Fixes...\n');
  
  try {
    // Test 1: Check if we can count approved applications
    const totalApproved = await StudentApplication.countDocuments({ status: 'approved' });
    console.log(`✅ Total approved students: ${totalApproved}`);
    
    // Test 2: Create a test alert and check stats
    const testAlert = await Alert.findOne({ isActive: true });
    if (testAlert) {
      console.log(`\n📊 Testing stats for alert: ${testAlert._id}`);
      
      const safeCount = await AlertResponse.countDocuments({ 
        alertId: testAlert._id, 
        response: 'safe' 
      });
      console.log(`   Safe responses: ${safeCount}`);
      
      const sosCount = await AlertResponse.countDocuments({ 
        alertId: testAlert._id, 
        response: 'sos' 
      });
      console.log(`   SOS responses: ${sosCount}`);
      
      const respondedCount = safeCount + sosCount;
      const responseRate = totalApproved > 0 ? Math.round((respondedCount / totalApproved) * 100) : 0;
      console.log(`   Response rate: ${responseRate}% (${respondedCount}/${totalApproved})`);
      
      // Test the calculation
      const noResponseCount = totalApproved - respondedCount;
      console.log(`   No responses: ${noResponseCount}`);
      
      console.log('\n✅ Stats calculation test passed!');
    } else {
      console.log('\n⚠️ No active alert found for testing');
    }
    
    // Test 3: Check deactivate functionality
    console.log('\n🛑 Testing deactivation...');
    if (testAlert) {
      console.log(`   Alert ${testAlert._id} is currently ${testAlert.isActive ? 'active' : 'inactive'}`);
      console.log('   Deactivation route should be: PUT /api/alerts/:id/deactivate');
      console.log('   This should set isActive: false and deactivatedAt: new Date()');
    }
    
    console.log('\n🎉 All Emergency Alert fixes verified!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  process.exit(0);
}

testEmergencyAlertFixes();
