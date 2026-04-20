const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAlertAPI() {
  console.log('🧪 Testing Alert API...\n');

  try {
    // Test 1: Test endpoint (no auth)
    console.log('1. Testing test endpoint...');
    const testResponse = await axios.get(`${API_BASE}/alerts/test`);
    console.log('✅ Test endpoint:', testResponse.data);

    // Test 2: Get active alert (should work with proper auth)
    console.log('\n2. Testing get active alert...');
    try {
      const activeResponse = await axios.get(`${API_BASE}/alerts/active`);
      console.log('✅ Get active alert:', activeResponse.data);
    } catch (error) {
      console.log('❌ Get active alert failed (expected - needs auth):', error.response?.status);
    }

    // Test 3: Create alert (should work with proper auth)
    console.log('\n3. Testing create alert...');
    try {
      const createResponse = await axios.post(`${API_BASE}/alerts`, {
        message: 'Test emergency alert',
        type: 'General'
      });
      console.log('✅ Create alert:', createResponse.data);
    } catch (error) {
      console.log('❌ Create alert failed (expected - needs auth):', error.response?.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAlertAPI();
