#!/bin/bash

echo "🧪 Testing Deactivation Route After Fixes..."

# Start server in background
echo "1. Starting server..."
node server.js &
SERVER_PID=$!
sleep 5

# Test the deactivation route
echo "2. Testing PUT /api/alerts/test-id/deactivate"
echo "   This should return 401 (auth required) not 404 (not found)"

TEST_ID="507f1f77bcf86cd799439011"

# Test without auth (should get 401, not 404)
echo "3. Testing without auth token:"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT \
  -H "Content-Type: application/json" \
  http://localhost:5000/api/alerts/$TEST_ID/deactivate)

HTTP_CODE=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
BODY=$(echo $RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo "   HTTP Status: $HTTP_CODE"
echo "   Response: $BODY"

if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✅ Route exists (401 = auth required)"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "   ❌ Route not found (404)"
else
    echo "   ⚠️ Unexpected status: $HTTP_CODE"
fi

# Test with fake auth (should get 401)
echo "4. Testing with fake token:"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token" \
  http://localhost:5000/api/alerts/$TEST_ID/deactivate)

HTTP_CODE=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
BODY=$(echo $RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo "   HTTP Status: $HTTP_CODE"
echo "   Response: $BODY"

if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✅ Route exists (401 = auth required)"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "   ❌ Route not found (404)"
else
    echo "   ⚠️ Unexpected status: $HTTP_CODE"
fi

# Kill the server
echo "5. Stopping server..."
kill $SERVER_PID 2>/dev/null

echo ""
echo "📋 Summary:"
echo "   - If you see 401: Route exists, auth is working"
echo "   - If you see 404: Route does NOT exist"
echo "   - If you see 500: Route exists but has error"

echo ""
echo "🎯 Next steps:"
echo "   1. Check browser console for auth errors"
echo "   2. Verify JWT token in localStorage"
echo "   3. Check if user has admin role"
