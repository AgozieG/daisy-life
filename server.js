import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ordersRouter from './routes/orders.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const normaliseOrigin = (origin) => origin.trim().replace(/\/$/, '');
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(normaliseOrigin)
  .filter(Boolean);

const renderOriginPattern = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i;

app.use(
  cors({
    origin: (origin, callback) => {
      const requestOrigin = origin ? normaliseOrigin(origin) : null;

      if (!requestOrigin || allowedOrigins.includes(requestOrigin) || renderOriginPattern.test(requestOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin not allowed by CORS: ${requestOrigin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'daisy-life-backend' }));
app.use('/api/orders', ordersRouter);

const frontendDist = path.join(__dirname, 'dist');

if (process.env.NODE_ENV === 'production' || fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ success: false, message: 'API route not found' });
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Fallback error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Daisy Life backend running on port ${PORT}`));
