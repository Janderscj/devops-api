import express from 'express';
import cors from 'cors';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

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

export default app;
