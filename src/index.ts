import { app } from './app';
import { connectDB } from './db';

const PORT = process.env.PORT || 3001;

async function startServer(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor notas-api escuchando en el puerto ${PORT}`);
  });
}

startServer();
