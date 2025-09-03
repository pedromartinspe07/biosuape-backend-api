import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import connectDB from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/v1', apiRoutes);

// Tratamento de rotas não encontradas (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// Middleware de tratamento de erros global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado no servidor!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
