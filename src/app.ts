import express, { Application } from 'express';
import notesRouter from './routes/notes';

export const app: Application = express();

app.use(express.json());

// Endpoints bajo /notes
app.use('/notes', notesRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenido a notas-api' });
});
