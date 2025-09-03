// src/config/db.ts
import mongoose from 'mongoose';

// Pega a URL de conexão do MongoDB das variáveis de ambiente
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:QesydXajnqGpnSRgiddlcERUsHAtTJfY@shuttle.proxy.rlwy.net:37405';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
  } catch (error) {
    console.error('Falha na conexão com o MongoDB:', error);
    process.exit(1); // Sai do processo com falha
  }
};

export default connectDB;