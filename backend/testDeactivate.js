// Test the actual deactivation route to see what error we get
const express = require('express');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
app.use('/api/alerts', alertRoutes);

// Test endpoint to show what routes are actually registered
app.get('/test-routes', (req, res) => {
  const routes = [];
  
  console.log('🔍 Checking registered routes:');
  
  app._router.stack.forEach(layer => {
    if (layer.route) {
      routes.push({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods || {}),
        hasHandler: !!layer.handle
      });
    }
  });
  
  // Look specifically for deactivate route
  const deactivateRoute = routes.find(r => 
    r.path && r.path.includes('deactivate')
  );
  
  if (deactivateRoute) {
    console.log('✅ Deactivate route found:', deactivateRoute.path);
    console.log('   Methods:', deactivateRoute.methods);
    console.log('   Has handler:', deactivateRoute.hasHandler);
  } else {
    console.log('❌ Deactivate route NOT found');
    console.log('   Available routes:');
    routes.forEach((r, i) => {
      if (r.path) {
        console.log(`     ${i + 1}. ${r.path} [${r.methods.join(', ')}]`);
      }
    });
  }
  
  res.json({ routes, deactivateRoute });
});

const server = app.listen(5005, () => {
  console.log('🌐 Test server on port 5005');
  console.log('📋 Test: curl -X PUT http://localhost:5005/api/alerts/YOUR_ID/deactivate');
  console.log('🎯 This should show if the route is properly registered');
  
  setTimeout(() => process.exit(0), 2000);
});
