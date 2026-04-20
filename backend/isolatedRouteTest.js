const express = require('express');
const alertRoutes = require('./routes/alertRoutes');

console.log('🧪 Isolated Route Test...\n');

const app = express();

// Apply middleware exactly like in server.js
app.use('/api/alerts', alertRoutes);

// Add a test route to verify router is working
app.get('/test-routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(layer => {
    if (layer.route) {
      routes.push({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods || {})
      });
    }
  });
  res.json({ routes });
});

const server = app.listen(5001, () => {
  console.log('🌐 Test server running on port 5001');
  console.log('📋 Test this URL: http://localhost:5001/test-routes');
  console.log('🎯 Looking for: PUT /api/alerts/:id/deactivate');
  
  setTimeout(() => {
    console.log('\n🔍 Checking registered routes...');
    const testReq = { method: 'PUT', path: '/api/alerts/507f1f77bcf86cd799439011/deactivate' };
    
    let found = false;
    app._router.stack.forEach(layer => {
      if (layer.route && layer.route.path) {
        const routePath = '/api/alerts' + layer.route.path;
        
        if (layer.route.path.includes(':id')) {
          const regex = new RegExp(layer.route.path.replace(':id', '[^/]+'));
          if (regex.test(testReq.path) && layer.route.methods[testReq.method]) {
            console.log(`✅ FOUND: ${routePath} [${Object.keys(layer.route.methods).join(', ')}]`);
            found = true;
          }
        }
      }
    });
    
    if (!found) {
      console.log('❌ Route not found!');
    }
    
    server.close();
    process.exit(0);
  }, 1000);
});
