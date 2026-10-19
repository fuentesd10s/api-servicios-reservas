import express from 'express';
import servicesRouter from './routes/services.router.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api/services', servicesRouter);
app.use(errorHandler);

export default app;