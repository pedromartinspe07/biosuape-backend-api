// src/routes/api.ts
import { Router } from 'express';

// Importa os controladores
import { createOcorrencia, getOcorrencias, getRelatorio, getMapaCalor } from '../controllers/ocorrenciaController';
import { register, login } from '../controllers/authController';

// Importa os middlewares
import { authMiddleware } from '../middleware/authMiddleware';
// Importe o middleware de validação para usuário/login (você pode ter um arquivo como 'validateUser')
// import { validateUser } from '../middleware/validationMiddleware'; 

const apiRouter = Router();

// --- Rotas de Autenticação ---
// Sub-router para rotas de autenticação
const authRouter = Router();

// Rotas públicas (não precisam de token)
// Adicione o middleware de validação aqui se você tiver um.
authRouter.post('/register', register); 
authRouter.post('/login', login);

// Anexa o sub-router ao router principal
apiRouter.use(authRouter);

// --- Rotas para Ocorrências ---
// Rotas que exigem autenticação
apiRouter.post('/ocorrencias', authMiddleware, createOcorrencia);
apiRouter.get('/ocorrencias', getOcorrencias);

// --- Rotas para Relatórios e Análises ---
// Rotas que exigem autenticação
apiRouter.get('/relatorio', authMiddleware, getRelatorio);
apiRouter.get('/mapa-calor', getMapaCalor);

export default apiRouter;