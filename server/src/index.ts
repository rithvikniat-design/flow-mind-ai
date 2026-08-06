import express from 'express';
// Trigger nodemon spatial release
import cors from 'cors';
import { config } from './config/config';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/error';

// Import Routes
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import agentRoutes from './routes/agentRoutes';
import kbRoutes from './routes/kbRoutes';
import workflowRoutes from './routes/workflowRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import memoryRoutes from './routes/memoryRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/memory', memoryRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    mode: config.IS_SUPABASE_CONFIGURED ? 'supabase' : 'mock-db',
    grokStatus: config.IS_GROK_CONFIGURED ? 'live' : 'simulated'
  });
});

// Serve Client Static Assets (Production SPA fallback)
import path from 'path';
import fs from 'fs';

const clientBuildPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Start Server
const port = Number(config.PORT) || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(` FlowMind AI API Server Running`);
  console.log(` Port: ${port}`);
  console.log(` Mode: ${config.IS_SUPABASE_CONFIGURED ? 'Supabase DB' : 'Local Persistent JSON'}`);
  console.log(` Grok: ${config.IS_GROK_CONFIGURED ? 'Connected' : 'Offline Simulation'}`);
  console.log(`=========================================`);
});
