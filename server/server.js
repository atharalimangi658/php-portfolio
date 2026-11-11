import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRecord, deleteRecord, readCollection, updateRecord } from './dataStore.js';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(serverDirectory, '.env') });

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

if (!adminUsername || !adminPassword || !jwtSecret) {
  throw new Error('ADMIN_USERNAME, ADMIN_PASSWORD, and JWT_SECRET must be set in server/.env');
}

app.use(cors((req, callback) => {
  const origin = req.get('Origin');
  let allowed = !origin || allowedOrigins.includes(origin);
  if (!allowed) {
    try {
      const requestOrigin = new URL(origin);
      allowed = requestOrigin.hostname === req.hostname && requestOrigin.port === '5173';
    } catch {
      allowed = false;
    }
  }
  callback(null, { origin: allowed });
}));
app.use(express.json({ limit: '1mb' }));

function credentialsMatch(value, expected) {
  const submitted = Buffer.from(String(value || ''));
  const known = Buffer.from(expected);
  return submitted.length === known.length && timingSafeEqual(submitted, known);
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Admin login required' });
  try {
    req.admin = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Your admin session is invalid or expired' });
  }
}

const loginAttempts = new Map();
function loginRateLimit(req, res, next) {
  const now = Date.now();
  const entry = loginAttempts.get(req.ip) || { count: 0, startedAt: now };
  if (now - entry.startedAt > 15 * 60 * 1000) { entry.count = 0; entry.startedAt = now; }
  if (entry.count >= 5) return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
  entry.count += 1;
  loginAttempts.set(req.ip, entry);
  return next();
}

app.post('/api/auth/login', loginRateLimit, (req, res) => {
  const usernameMatches = credentialsMatch(req.body.username, adminUsername);
  const passwordMatches = credentialsMatch(req.body.password, adminPassword);
  if (!usernameMatches || !passwordMatches) {
    console.warn('Admin login rejected:', { usernameMatches, passwordMatches });
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  loginAttempts.delete(req.ip);
  const token = jwt.sign({ username: adminUsername, role: 'admin' }, jwtSecret, { expiresIn: '8h' });
  return res.json({ token, expiresIn: '8h' });
});

const seedProjects = [
  { number: '01', title: 'MR FOLLOW', subtitle: 'Human-Following Robot', image: '/images/mr-follow.png', description: 'A human-following robotic system designed to detect and follow a person using ultrasonic sensors and infrared sensors. The robot supports automatic following and manual control through Bluetooth.', tags: ['Arduino Uno', 'Ultrasonic Sensor', 'IR Sensors', 'L293D', 'HC-06 Bluetooth', 'MIT App Inventor'] },
  { number: '02', title: 'UV INDEX METER', subtitle: 'UV Index Monitoring System', image: '/images/uv-index.png', description: 'An Arduino-based UV monitoring project designed to detect ultraviolet radiation levels using a UV sensor and display the readings through a computer-based interface.', tags: ['Arduino Uno', 'UV Sensor', 'Display', 'Electronics', 'Processing IDE'] },
  { number: '03', title: 'SWAD FOODS PK', subtitle: 'E-commerce Business', image: '/images/swad-foods.jpg', description: 'An e-commerce business focused on traditional Shikarpuri pickles and food products.', tags: ['Shopify', 'E-commerce', 'Store Management', 'Digital Marketing'] },
];

const seedCertificates = [
  { id: '5d1c50f1-b343-4e7a-8124-5d3d5a7fc001', title: 'Certificate of Appreciation', issuer: 'System X 1.0', role: 'Organizer', image: '/images/certificate-systemx.png', description: 'Recognition for dedication, teamwork, and valuable contribution to the successful organization of Hackathon 1.0.' },
  { id: '5d1c50f1-b343-4e7a-8124-5d3d5a7fc002', title: 'Certificate of Participation', issuer: 'IEEE', role: 'Participant', event: 'Build with AI: From Concept to Functional App', image: '/images/certificate-ieee.jpg', description: 'Participation certificate for the IEEE event “Build with AI: From Concept to Functional App”.' },
];

function requireFields(body, fields) {
  const missing = fields.filter((field) => !String(body[field] ?? '').trim());
  return missing.length ? `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}` : null;
}

function makeCrudRoutes(resource, seed, required) {
  app.get(`/api/${resource}`, async (_req, res, next) => {
    try { res.json(await readCollection(resource, seed)); } catch (error) { next(error); }
  });

  app.post(`/api/${resource}`, requireAdmin, async (req, res, next) => {
    const validation = requireFields(req.body, required);
    if (validation) return res.status(400).json({ error: validation });
    try {
      const record = { ...req.body, id: req.body.id || randomUUID() };
      if (resource === 'projects') {
        const records = await readCollection(resource, seed);
        record.number = String(records.length + 1).padStart(2, '0');
      }
      res.status(201).json(await createRecord(resource, record));
    } catch (error) { next(error); }
  });

  app.put(`/api/${resource}/:id`, requireAdmin, async (req, res, next) => {
    const validation = requireFields(req.body, required);
    if (validation) return res.status(400).json({ error: validation });
    try {
      const records = await readCollection(resource, seed);
      const existing = records.find((record) => (record.id || record.number) === req.params.id);
      if (!existing) return res.status(404).json({ error: 'Record not found' });
      const { id: _ignoredId, ...changes } = req.body;
      const record = await updateRecord(resource, existing.id, changes);
      if (!record) return res.status(404).json({ error: 'Record not found' });
      res.json(record);
    } catch (error) { next(error); }
  });

  app.delete(`/api/${resource}/:id`, requireAdmin, async (req, res, next) => {
    try {
      const records = await readCollection(resource, seed);
      const existing = records.find((record) => (record.id || record.number) === req.params.id);
      if (!existing) return res.status(404).json({ error: 'Record not found' });
      await deleteRecord(resource, existing.id);
      if (resource === 'projects') {
        const kept = await readCollection(resource, seed);
        await Promise.all(kept.map((record, index) => updateRecord(resource, record.id, { number: String(index + 1).padStart(2, '0') })));
      }
      res.status(204).end();
    } catch (error) { next(error); }
  });
}

makeCrudRoutes('projects', seedProjects, ['title', 'subtitle', 'description']);
makeCrudRoutes('certificates', seedCertificates, ['title', 'issuer', 'role', 'description']);

app.get('/api/messages', requireAdmin, async (_req, res, next) => {
  try { res.json(await readCollection('messages', [])); } catch (error) { next(error); }
});
app.post('/api/messages', async (req, res, next) => {
  const validation = requireFields(req.body, ['name', 'email', 'message']);
  if (validation) return res.status(400).json({ error: validation });
  try {
    const message = await createRecord('messages', { id: randomUUID(), ...req.body, receivedAt: new Date().toISOString() });
    res.status(201).json(message);
  } catch (error) { next(error); }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => console.log(`Portfolio API running on http://localhost:${port}`));
