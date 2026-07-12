import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './src/config/db.js';
import { config } from './src/config/env.js';
import logger from './src/utils/logger.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import researchRoutes from './src/routes/research.js';
import authRoutes from './src/routes/auth.js';

// Connect to MongoDB
connectDB();

const app = express();

// Security & Logging Middlewares
app.use(helmet());
app.use(morgan('dev', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/research', researchRoutes);
app.use('/api/v1/auth', authRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
