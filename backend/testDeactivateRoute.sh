#!/bin/bash

echo "🧪 Testing Alert Deactivation Route with curl..."

# First, let's start the server and test
echo "1. Starting server in background..."
node server.js &
SERVER_PID=$!
sleep 3

echo "2. Testing deactivation route..."

# Test with a sample alert ID (you'll need to replace this with a real alert ID)
TEST_ID="507f1f77bcf86cd799439011"

# Test the deactivation endpoint
echo "3. Testing PUT /api/alerts/$TEST_ID/deactivate"
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{}' \
  http://localhost:5000/api/alerts/$TEST_ID/deactivate \
  -w "\nHTTP Status: %{http_code}\nResponse: %{response_code}\n"

echo "4. Testing if route exists (should get 401 without token)..."
curl -X PUT \
  -H "Content-Type: application/json" \
  http://localhost:5000/api/alerts/$TEST_ID/deactivate \
  -w "\nHTTP Status: %{http_code}\n"

# Kill the server
echo "5. Stopping server..."
kill $SERVER_PID

echo "✅ Route test completed!"
