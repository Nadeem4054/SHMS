#!/bin/bash

echo "🧪 Testing Real Server Setup..."

# Start the actual server in background
echo "1. Starting actual server..."
node server.js &
SERVER_PID=$!
sleep 5

# Test the deactivation route
echo "2. Testing deactivation on actual server..."

TEST_ID="507f1f77bcf86cd799439011"

# Test with auth (should work)
echo "3. Testing with admin token..."
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYjIifQ==" \
  -d '{}' \
  http://localhost:5000/api/alerts/$TEST_ID/deactivate \
  -w "\nHTTP Status: %{http_code}\nResponse: %{response_code}\n"

# Test without auth (should get 401)
echo "4. Testing without token..."
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:5000/api/alerts/$TEST_ID/deactivate \
  -w "\nHTTP Status: %{http_code}\nResponse: %{response_code}\n"

# Test route exists
echo "5. Testing if route exists (should get 401 without auth, not 404)..."
curl -X PUT \
  -H "Content-Type: application/json" \
  http://localhost:5000/api/alerts/$TEST_ID/deactivate \
  -w "\nHTTP Status: %{http_code}\nResponse: %{response_code}\n"

# Kill the server
echo "6. Stopping server..."
kill $SERVER_PID

echo "✅ Test completed!"
echo ""
echo "📋 Expected Results:"
echo "   - With valid token: 200"
echo "   - Without token: 401 (not 404)"
echo "   - Route should exist and be callable"
