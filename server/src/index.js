import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import clinicalRoutes from './routes/clinicalRoutes.js';
import labRoutes from './routes/labRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Bulletproof CORS for Vercel Frontend + Render Backend
const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (origin.endsWith('.onrender.com')) return true;
  const envOrigins = (process.env.CLIENT_URL || '').split(',').map((u) => u.trim());
  if (envOrigins.includes(origin) || envOrigins.includes('*')) return true;
  return true;
};

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin || true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'MedAssist Clinic Operations & Patient Care Portal',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Production Static Client Serving (for single-service PaaS deployments & Docker)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[MedAssist Server] Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
}

// Centralized error handler
app.use(errorHandler);

let server;
if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`[MedAssist Server] Running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n[MedAssist Server] Shutting down gracefully...');
    server.close(async () => {
      await mongoose.connection.close(false);
      console.log('[MedAssist Server] Database connection closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export default app;
