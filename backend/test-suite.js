const http = require('http');

const runTests = async () => {
  const app = require('./server');
  const server = app.listen(5099, async () => {
    console.log('[Test Suite] Ephemeral test server running on port 5099...\n');

    const request = (path, method = 'GET', body = null, token = null) => {
      return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const headers = {
          'Content-Type': 'application/json',
        };
        if (payload) headers['Content-Length'] = Buffer.byteLength(payload);
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(
          {
            hostname: '127.0.0.1',
            port: 5099,
            path,
            method,
            headers,
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                resolve({ status: res.statusCode, data: parsed });
              } catch (e) {
                resolve({ status: res.statusCode, raw: data });
              }
            });
          }
        );

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
      });
    };

    let passed = 0;
    let failed = 0;

    const assert = (condition, name) => {
      if (condition) {
        console.log(`  ✓ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`  ✗ [FAIL] ${name}`);
        failed++;
      }
    };

    try {
      console.log('Testing System & Health Endpoints:');
      const rootRes = await request('/');
      assert(rootRes.status === 200 && rootRes.data?.status === 'online', 'GET / returns 200 online');

      console.log('\nTesting Analytics & Stats Endpoints:');
      const statsRes = await request('/api/stats/summary');
      assert(
        statsRes.status === 200 && statsRes.data?.stats?.totalDonations >= 0,
        'GET /api/stats/summary returns aggregated metrics'
      );

      console.log('\nTesting Authentication Endpoints:');
      const donorLogin = await request('/api/auth/login', 'POST', {
        email: 'donor@annadaan.org',
        password: 'password123',
      });
      assert(
        donorLogin.status === 200 && donorLogin.data?.token && donorLogin.data?.user?.role === 'donor',
        'POST /api/auth/login authenticates donor successfully'
      );
      const donorToken = donorLogin.data?.token;

      const ngoLogin = await request('/api/auth/login', 'POST', {
        email: 'ngo@shelter.org',
        password: 'password123',
      });
      assert(
        ngoLogin.status === 200 && ngoLogin.data?.token && ngoLogin.data?.user?.role === 'ngo',
        'POST /api/auth/login authenticates NGO successfully'
      );
      const ngoToken = ngoLogin.data?.token;

      const meRes = await request('/api/auth/me', 'GET', null, donorToken);
      assert(meRes.status === 200 && meRes.data?.user?.email === 'donor@annadaan.org', 'GET /api/auth/me returns current user');

      const randomEmail = `volunteer_${Date.now()}@test.org`;
      const regRes = await request('/api/auth/register', 'POST', {
        name: 'Test Volunteer',
        email: randomEmail,
        password: 'password123',
        role: 'donor',
        phone: '+91 99887 76655',
        organization: 'Community Caterers',
        address: '100 Street',
        city: 'tenali',
      });
      assert(regRes.status === 201 && regRes.data?.token, 'POST /api/auth/register registers new user with token');

      console.log('\nTesting Donation Flow & Operations:');
      const feedRes = await request('/api/donations');
      assert(feedRes.status === 200 && Array.isArray(feedRes.data?.donations), 'GET /api/donations returns donation list');

      const filterRes = await request('/api/donations?city=tenali&foodType=Veg');
      assert(filterRes.status === 200 && Array.isArray(filterRes.data?.donations), 'GET /api/donations?city=tenali&foodType=Veg filters correctly');

      const createRes = await request(
        '/api/donations',
        'POST',
        {
          title: 'Automated Test Buffet Package',
          foodType: 'Veg',
          quantity: '30 Portions',
          cookedTime: new Date().toISOString(),
          expiryHours: 6,
          pickupAddress: 'Kitchen Dock 1',
          city: 'tenali',
          notes: 'Test creation package',
        },
        donorToken
      );
      assert(createRes.status === 201 && createRes.data?.donation?._id, 'POST /api/donations creates new listing (Donor only)');
      const createdId = createRes.data?.donation?._id;

      const myDonRes = await request('/api/donations/my-donations', 'GET', null, donorToken);
      assert(
        myDonRes.status === 200 && myDonRes.data?.donations?.some((d) => d._id === createdId),
        'GET /api/donations/my-donations includes the created listing'
      );

      const singleRes = await request(`/api/donations/${createdId}`);
      assert(singleRes.status === 200 && singleRes.data?.donation?.title === 'Automated Test Buffet Package', 'GET /api/donations/:id returns item');

      const claimRes = await request(`/api/donations/${createdId}/claim`, 'PATCH', null, ngoToken);
      assert(
        claimRes.status === 200 && claimRes.data?.donation?.status === 'Claimed',
        'PATCH /api/donations/:id/claim atomically claims food for NGO'
      );

      const claimsRes = await request('/api/donations/my-claims', 'GET', null, ngoToken);
      assert(
        claimsRes.status === 200 && claimsRes.data?.donations?.some((d) => d._id === createdId),
        'GET /api/donations/my-claims includes the claimed listing'
      );

      const completeRes = await request(`/api/donations/${createdId}/complete`, 'PATCH', null, ngoToken);
      assert(
        completeRes.status === 200 && completeRes.data?.donation?.status === 'Completed',
        'PATCH /api/donations/:id/complete marks food rescue verified and completed'
      );

      console.log(`\n===========================================`);
      console.log(`[TEST SUMMARY]: ${passed} PASSED, ${failed} FAILED`);
      console.log(`===========================================\n`);

      server.close(() => {
        process.exit(failed > 0 ? 1 : 0);
      });
    } catch (err) {
      console.error('[Test Error]:', err);
      server.close(() => process.exit(1));
    }
  });
};

runTests();
