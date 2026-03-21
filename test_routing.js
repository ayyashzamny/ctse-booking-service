const express = require('express');
const request = require('supertest');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'booking-service' });
});

router.get('/:userId', (req, res) => {
  res.json({ bookings: [], total: 0, param: req.params.userId });
});

const app = express();
app.use('/api/bookings', router);

async function runTest() {
  try {
    const res1 = await request(app).get('/api/bookings/health');
    console.log('Path: /api/bookings/health ->', res1.body.status || 'Shadowed by ' + res1.body.param);

    const res2 = await request(app).get('/api/bookings/health/');
    console.log('Path: /api/bookings/health/ ->', res2.body.status || 'Shadowed by ' + res2.body.param);

  } catch (err) {
    console.error('Test error:', err);
  }
}

runTest();
