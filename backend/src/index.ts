import { config } from 'dotenv';
config({ path: '.env.local' });
config();
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import orders from './routes/orders.js';
import admin from './routes/admin.js';
import webhooks from './routes/webhooks.js';
import notifications from './routes/notifications.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:8081', 'http://localhost:19006'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'kolia-api', version: '1.0.0' }));
app.get('/health', (c) => c.json({ status: 'ok' }));

// Routes
app.route('/api/orders', orders);
app.route('/api/admin', admin);
app.route('/api/webhooks', webhooks);
app.route('/api/notifications', notifications);

// 404 handler
app.notFound((c) => c.json({ error: 'Not found', code: 'NOT_FOUND' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500);
});

const port = Number(process.env.PORT) || 3000;

console.log(`Kolia API starting on port ${port}...`);

serve({ fetch: app.fetch, port }, () => {
  console.log(`Kolia API running at http://localhost:${port}`);
});
