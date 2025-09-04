// src/server.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/api';
import connectDB from './config/db';
import { AppError } from './utils/AppError'; // Classe de erro personalizada

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- Configuração e Middlewares de Segurança ---

// Habilita o CORS para permitir requisições de outras origens
app.use(cors());

// Adiciona o middleware Helmet para segurança HTTP
app.use(helmet());

// Analisa o corpo da requisição em JSON
app.use(express.json());

// Logger de requisições, útil para depuração
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Rotas da API ---

// As rotas da API são prefixadas com /api para clareza e versionamento
app.use('/api', apiRoutes);

// --- Tratamento de Erros ---

// Middleware para lidar com rotas não encontradas (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new AppError('A rota solicitada não foi encontrada.', 404);
  next(error);
});

// Middleware de tratamento de erros global
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  // Define o status do erro (padrão 500) e a mensagem
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  // Loga o erro completo em ambiente de desenvolvimento
  if (NODE_ENV === 'development') {
    console.error(`Status: ${statusCode}, Mensagem: ${message}`);
    console.error(err.stack);
  }

  // Envia a resposta de erro ao cliente
  res.status(statusCode).json({
    status: 'error',
    message: message,
    // Adiciona o stack trace em modo de desenvolvimento para depuração
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// --- Inicialização do Servidor ---

// Função assíncrona para conectar ao banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    // Conecta ao MongoDB antes de iniciar o servidor
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando em ambiente de ${NODE_ENV} na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
};

startServer();