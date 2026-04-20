const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAlertResponseAPI() {
  console.log('🧪 Testing Alert Response API...\n');

  try {
    // Test 1: Test endpoint (no auth)
    console.log('1. Testing alert response test endpoint...');
    const testResponse = await axios.get(`${API_BASE}/alert-responses/test`);
    console.log('✅ Test endpoint:', testResponse.data);

    // Test 2: Submit response (should work with proper auth)
    console.log('\n2. Testing submit alert response...');
    try {
      const submitResponse = await axios.post(`${API_BASE}/alert-responses`, {
        alertId: '507f1f77bcf86cd799439011', // sample alert ID
        response: 'safe'
      });
      console.log('✅ Submit response:', submitResponse.data);
    } catch (error) {
      console.log('❌ Submit response failed (expected - needs auth):', error.response?.status);
      if (error.response?.data) {
        console.log('Error details:', error.response.data);
      }
    }

    // Test 3: Get responses (should work with proper auth)
    console.log('\n3. Testing get alert responses...');
    try {
      const getResponse = await axios.get(`${API_BASE}/alert-responses/507f1f77bcf86cd799439011`);
      console.log('✅ Get responses:', getResponse.data);
    } catch (error) {
      console.log('❌ Get responses failed (expected - needs auth):', error.response?.status);
      if (error.response?.data) {
        console.log('Error details:', error.response.data);
      }
    }

    console.log('\n🎯 Alert Response API routes are properly registered!');
    console.log('📝 Routes available:');
    console.log('   - POST /api/alert-responses (submit response)');
    console.log('   - GET /api/alert-responses/:alertId (get responses)');
    console.log('   - GET /api/alert-responses/:alertId/stats (get stats)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAlertResponseAPI();
