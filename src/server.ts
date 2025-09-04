import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import connectDB from './config/db';

dotenv.config();

// Variáveis de ambiente
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

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
  console.error(err.stack); // Loga o stack trace do erro no console do servidor

  // Constrói a resposta de erro com base no ambiente
  const errorResponse = {
    message: 'Algo deu errado no servidor!',
    ...(NODE_ENV === 'development' && { error: err.stack }), // Adiciona o stack trace somente em desenvolvimento
  };

  res.status(500).json(errorResponse);
});

// Iniciar o servidor somente após a conexão com o banco de dados
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em ambiente de ${NODE_ENV} na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();