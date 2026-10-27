import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import authroutes from './routes/auth.routes.js';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import specs from '#config/swagger.js';
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(cookieParser());

app.get('/', (req, res) => {
  logger.info('Hello from devops-api!');
  res.status(200).send('Hello from devops-api!');
});

app.get('/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'Healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  res.status(200).json({ status: 'API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authroutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app;
