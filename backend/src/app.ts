import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', routes);

app.get('/health', (_, res) => {
  res.json({ status: 'ok', app: 'Rotina+', version: '1.0.0' });
});

export default app;
