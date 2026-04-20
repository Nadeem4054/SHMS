const express = require('express');

// Test if alert routes are properly registered
function testAlertRoutes() {
  console.log('🧪 Testing Alert Routes Registration...\n');
  
  try {
    // Test if routes module loads
    const alertRoutes = require('./routes/alertRoutes');
    console.log('✅ Alert routes module loaded');
    
    // Test if controller functions are available
    const alertController = require('./controllers/alertController');
    console.log('✅ Alert controller loaded');
    console.log('📝 Available functions:', Object.keys(alertController));
    
    // Create a test Express app to check routes
    const app = express();
    
    // Register routes exactly like in server.js
    app.use('/api/alerts', alertRoutes);
    
    // Test the deactivation route
    const routes = app._router.stack || [];
    const deactivateRoute = routes.find(route => 
      route.route && route.route.path === '/api/alerts/:id/deactivate'
    );
    
    if (deactivateRoute) {
      console.log('✅ Deactivate route found:', deactivateRoute.route.path);
      console.log('   Methods:', Object.keys(deactivateRoute.route.methods));
    } else {
      console.log('❌ Deactivate route NOT found');
      
      // List all available routes
      console.log('\n📋 Available routes:');
      routes.forEach((route, index) => {
        if (route.route) {
          console.log(`   ${index + 1}. ${route.route.path} - ${Object.keys(route.route.methods || {}).join(', ')}`);
        }
      });
    }
    
    console.log('\n🎯 Expected route: PUT /api/alerts/:id/deactivate');
    console.log('🎯 Controller function: deactivateAlert');
    console.log('🎯 Should be exported in module.exports');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  process.exit(0);
}

testAlertRoutes();
