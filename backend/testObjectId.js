// Test ObjectId conversion logic
const mongoose = require('mongoose');

console.log('🧪 Testing ObjectId Conversion Logic...\n');

// Test 1: Create a sample ObjectId
const sampleId = '507f1f77bcf86cd799439011';
console.log(`1. Sample ID: ${sampleId} (type: ${typeof sampleId})`);

// Test 2: Convert to ObjectId
try {
  const objectId = new mongoose.Types.ObjectId(sampleId);
  console.log(`2. ObjectId: ${objectId} (type: ${typeof objectId})`);
  
  // Test 3: Convert back to string
  const backToString = objectId.toString();
  console.log(`3. Back to string: ${backToString} (type: ${typeof backToString})`);
  
  // Test 4: Compare string vs ObjectId
  console.log(`4. Comparisons:`);
  console.log(`   String == ObjectId: ${sampleId == objectId}`);
  console.log(`   String === ObjectId: ${sampleId === objectId}`);
  console.log(`   String == ObjectId.toString(): ${sampleId == backToString}`);
  console.log(`   String === ObjectId.toString(): ${sampleId === backToString}`);
  
  // Test 5: Simulate MongoDB query conditions
  console.log(`5. MongoDB query simulation:`);
  const queryWithString = { alertId: sampleId };
  const queryWithObjectId = { alertId: objectId };
  
  console.log(`   Query with string:`, queryWithString);
  console.log(`   Query with ObjectId:`, queryWithObjectId);
  
  console.log('\n✅ ObjectId conversion working correctly!');
  console.log('🔍 The issue might be in the actual database data or query execution.');
  
} catch (error) {
  console.error('❌ ObjectId conversion error:', error.message);
}

console.log('\n📋 Debugging tips:');
console.log('1. Check if AlertResponse documents actually exist');
console.log('2. Verify alertId values in AlertResponse collection');
console.log('3. Check if the alertId parameter matches stored values');
console.log('4. Look at server logs when stats endpoint is called');
