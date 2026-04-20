// Simple test to check if deactivation route works
const express = require('express');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
app.use('/api/alerts', alertRoutes);

// Test request
console.log('🧪 Testing deactivation route...');
console.log('📋 Available routes after registration:');

// Manually check if route exists
app._router.stack.forEach((layer, index) => {
  if (layer.route) {
    console.log(`Route ${index + 1}: ${layer.route.path} [${Object.keys(layer.route.methods || {}).join(', ')}]`);
  }
});

console.log('\n🎯 Testing specific route match...');

// Simulate the route matching
const testPath = '/api/alerts/507f1f77bcf86cd799439011/deactivate';
const testMethod = 'PUT';

let routeFound = false;
app._router.stack.forEach(layer => {
  if (layer.route && layer.route.path) {
    const routePath = '/api/alerts' + layer.route.path;
    console.log(`Checking: ${testMethod} ${testPath} vs ${routePath}`);
    
    if (routePath.includes(':id')) {
      const regex = new RegExp(routePath.replace(':id', '[^/]+'));
      if (regex.test(testPath) && layer.route.methods[testMethod]) {
        routeFound = true;
        console.log('✅ ROUTE MATCH FOUND!');
      }
    }
  }
});

if (routeFound) {
  console.log('✅ Deactivation route should work!');
} else {
  console.log('❌ Deactivation route not properly registered');
}

process.exit(0);
