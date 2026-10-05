// ============================================
// HuntOS API Server
// Engineered by Niranjan Krishnakumar
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('https');

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { startReminderJob } = require('./jobs/reminderJob');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow browser extensions (chrome-extension://), curl, mobile apps, or local dev
      if (!origin || origin.startsWith('chrome-extension://') || allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for portfolio & dev demos
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ─── Health Check & Platform Meta ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    platform: 'HuntOS Career Intelligence Platform',
    engineered_by: 'Niranjan Krishnakumar',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/ai', aiRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found on HuntOS API', data: null });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(`[ERROR] [${new Date().toISOString()}]`, err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    data: null,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ HuntOS API Server running on port ${PORT}`);
  console.log(`🚀 Engineered by Niranjan Krishnakumar`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);

  // Start cron reminder job
  startReminderJob();
});

module.exports = app;
