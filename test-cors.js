// Test CORS configuration
const https = require('https');

console.log('🔍 Testing CORS configuration...\n');

const testCORS = () => {
  const options = {
    hostname: 'budget-expense-tracker-rtel.onrender.com',
    port: 443,
    path: '/health',
    method: 'GET',
    headers: {
      'Origin': 'https://budgetexpensetracker-5vpwk61y2-nyandorolyn-gmailcoms-projects.vercel.app',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  };

  const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    
    if (res.headers['access-control-allow-origin']) {
      const corsOrigin = res.headers['access-control-allow-origin'];
      console.log('\n🌐 CORS Origin:', corsOrigin);
      
      const expectedOrigin = 'https://budgetexpensetracker-5vpwk61y2-nyandorolyn-gmailcoms-projects.vercel.app';
      
      if (corsOrigin === expectedOrigin) {
        console.log('✅ CORS is correctly configured!');
      } else {
        console.log('❌ CORS needs to be updated in Render dashboard');
        console.log('Expected:', expectedOrigin);
        console.log('Current:', corsOrigin);
      }
    } else {
      console.log('❌ No CORS headers found');
    }
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
  });

  req.end();
};

testCORS();
