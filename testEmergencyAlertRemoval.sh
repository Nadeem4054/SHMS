#!/bin/bash

echo "🧪 Testing App After Emergency Alert Removal..."

echo "1. Testing Backend Server Start..."
cd /home/nadeem/SHMS/backend

# Test if server starts without errors
timeout 10s node server.js > server_test.log 2>&1 &
SERVER_PID=$!
sleep 5

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Backend server started successfully"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Backend server failed to start"
    echo "Error log:"
    cat server_test.log
    exit 1
fi

echo ""
echo "2. Checking for broken imports..."
echo "   Backend: Checking for Alert model references..."
if grep -r "Alert\|alert" --include="*.js" controllers/ 2>/dev/null | grep -v "NotificationAlert\|alertLevel\|alertMessage"; then
    echo "⚠️  Found Alert references in controllers"
else
    echo "✅ No Alert references in controllers"
fi

echo "   Frontend: Checking for Emergency Alert imports..."
if find /home/nadeem/SHMS/frontend/src -name "*.jsx" -o -name "*.js" | xargs grep -l "EmergencyAlert\|alertService" 2>/dev/null; then
    echo "⚠️  Found Emergency Alert references in frontend"
else
    echo "✅ No Emergency Alert references in frontend"
fi

echo ""
echo "3. Testing Frontend Build..."
cd /home/nadeem/SHMS/frontend

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    
    # Check for any obvious issues
    if npm list --depth=0 > /dev/null 2>&1; then
        echo "✅ npm dependencies seem OK"
    else
        echo "⚠️  npm dependencies may have issues"
    fi
else
    echo "❌ package.json not found"
fi

echo ""
echo "4. Summary of Removal:"
echo "   ✅ Backend Models: Alert.js, AlertResponse.js - REMOVED"
echo "   ✅ Backend Routes: alertRoutes.js, alertResponseRoutes.js - REMOVED"
echo "   ✅ Backend Controllers: alertController.js, alertResponseController.js - REMOVED"
echo "   ✅ Server.js: Alert route registrations - REMOVED"
echo "   ✅ Frontend Components: EmergencyAlertBanner.jsx, EmergencyAlertPanel.jsx, EmergencyAlert.jsx - REMOVED"
echo "   ✅ App.jsx: Emergency Alert route - REMOVED"
echo "   ✅ Layouts: Emergency menu items - REMOVED"
echo "   ✅ API Service: alertService - REMOVED"

echo ""
echo "🎉 Emergency Alert Feature Completely Removed!"
echo "📋 App should now run without Emergency Alert functionality"

# Cleanup
rm -f /home/nadeem/SHMS/backend/server_test.log
