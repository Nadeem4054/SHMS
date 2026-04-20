// Create a minimal working deactivation route
const express = require('express');
const Alert = require('./models/Alert');

const app = express();

// Add the deactivation route directly to app
app.put('/api/alerts/:id/deactivate', async (req, res) => {
  console.log('🛑 MINIMAL DEACTIVATE ROUTE HIT');
  console.log('Alert ID:', req.params.id);
  
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isActive: false, deactivatedAt: new Date() },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    console.log('✅ Alert deactivated successfully');
    res.json({ message: 'Alert deactivated', alert });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Minimal test server working' });
});

const server = app.listen(5002, () => {
  console.log('🌐 Minimal test server running on port 5002');
  console.log('🎯 Test: curl -X PUT http://localhost:5002/api/alerts/YOUR_ALERT_ID/deactivate');
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
});
