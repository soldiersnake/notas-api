import mongoose from 'mongoose';

export async function connectDB(uri?: string): Promise<void> {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27019/notas-api';
  try {
    await mongoose.connect(mongoUri);
    console.log(`Conectado a MongoDB en ${mongoUri}`);
  } catch (error) {
    console.error(`Error al conectar con MongoDB en ${mongoUri}:`, error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
