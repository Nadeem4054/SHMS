#!/bin/bash

echo "🧪 Testing Alert Stats Endpoint with Enhanced Logging..."

# Start server in background
echo "1. Starting server..."
node server.js &
SERVER_PID=$!
sleep 5

# Test the stats endpoint
echo "2. Testing GET /api/alerts/test-id/stats"
echo "   This should show detailed logging in server console"

TEST_ID="507f1f77bcf86cd799439011"

# Test with auth (will fail auth but show logging)
echo "3. Testing stats endpoint (should show ObjectId conversion logs):"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token" \
  http://localhost:5000/api/alerts/$TEST_ID/stats \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "4. Check server console output for:"
echo "   🔍 'Fetching stats for alertId: ... (type: string)'"
echo "   🔍 'Converted alertId to ObjectId: ...'"
echo "   📊 'Found X responses for alert ...'"
echo "   📋 'Responses: [...]'"

# Kill the server
echo "5. Stopping server..."
kill $SERVER_PID 2>/dev/null

echo ""
echo "📋 Debugging Steps:"
echo "   1. Look at server console logs from this test"
echo "   2. Check if responses are found (should be > 0)"
echo "   3. Verify alertId values match between Alert and AlertResponse"
echo "   4. If responses = 0, check if student actually submitted response"

echo ""
echo "🎯 Expected Console Output:"
echo "   🔍 Fetching stats for alertId: 507f1f77bcf86cd799439011 (type: string)"
echo "   🔍 Converted alertId to ObjectId: 507f1f77bcf86cd799439011"
echo "   📊 Found X responses for alert 507f1f77bcf86cd799439011:"
echo "   📋 Responses: [{ alertId: '...', studentId: '...', response: 'safe', ... }]"
