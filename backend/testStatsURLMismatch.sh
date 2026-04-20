#!/bin/bash

echo "🧪 Testing Stats Route URL Mismatch..."

# Start server in background
echo "1. Starting server..."
node server.js &
SERVER_PID=$!
sleep 5

TEST_ID="507f1f77bcf86cd799439011"

echo "2. Testing Frontend URL: GET /api/alerts/$TEST_ID/stats"
echo "   (This is what frontend calls)"

FRONTEND_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token" \
  http://localhost:5000/api/alerts/$TEST_ID/stats)

FRONTEND_CODE=$(echo $FRONTEND_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
FRONTEND_BODY=$(echo $FRONTEND_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo "   HTTP Status: $FRONTEND_CODE"
echo "   Response: $FRONTEND_BODY"

echo ""
echo "3. Testing AlertResponse URL: GET /api/alert-responses/$TEST_ID/stats"
echo "   (This is NOT what frontend calls)"

BACKEND_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token" \
  http://localhost:5000/api/alert-responses/$TEST_ID/stats)

BACKEND_CODE=$(echo $BACKEND_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
BACKEND_BODY=$(echo $BACKEND_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo "   HTTP Status: $BACKEND_CODE"
echo "   Response: $BACKEND_BODY"

echo ""
echo "4. URL MISMATCH ANALYSIS:"
echo "   Frontend calls: /api/alerts/:id/stats"
echo "   Backend has:    /api/alerts/:id/stats (alertController)"
echo "   Backend has:    /api/alert-responses/:id/stats (alertResponseController)"
echo ""
echo "   ✅ Frontend URL matches alertController route"
echo "   ❌ Frontend does NOT call alertResponseController route"

# Kill the server
echo "5. Stopping server..."
kill $SERVER_PID 2>/dev/null

echo ""
echo "📋 SOLUTION:"
echo "   The frontend is calling the CORRECT route (/api/alerts/:id/stats)"
echo "   The issue is in the alertController getAlertStats function"
echo "   Both functions need the same fixes (ObjectId conversion, etc.)"

echo ""
echo "🎯 NEXT STEPS:"
echo "   1. Check server console logs for ObjectId conversion"
echo "   2. Verify alertController getAlertStats is working"
echo "   3. Make sure both stats functions have identical logic"
