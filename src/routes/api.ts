// src/routes/api.ts

import { Router } from 'express';

// Importa os controladores
import { createOcorrencia, getOcorrencias, getRelatorio, getMapaCalor } from '../controllers/ocorrenciaController';
import { register, login } from '../controllers/authController';

// Importa os middlewares
import { authMiddleware } from '../middleware/authMiddleware';
import { validateLogin, validateRegister, validateOcorrencia } from '../middleware/validationMiddleware'; 

// Cria o router principal da API com um prefixo de versão
const apiRouter = Router();

// --- Rotas Públicas (sem autenticação) ---
// Perfeito para endpoints de login e registro
apiRouter.post('/v1/register', validateRegister, register);
apiRouter.post('/v1/login', validateLogin, login);

// O endpoint de mapa de calor pode ser público, pois não expõe dados sensíveis do usuário
apiRouter.get('/v1/mapa-calor', getMapaCalor);

// --- Rotas Protegidas (com autenticação) ---
// Use o middleware de autenticação para proteger todas as rotas abaixo
apiRouter.use('/v1', authMiddleware);

// Rotas de Ocorrências
apiRouter.post('/v1/ocorrencias', validateOcorrencia, createOcorrencia);
apiRouter.get('/v1/ocorrencias', getOcorrencias);

// Rotas de Relatórios e Análises
apiRouter.get('/v1/relatorio', getRelatorio);

export default apiRouter;