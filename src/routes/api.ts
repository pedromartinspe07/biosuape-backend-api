// src/routes/api.ts

import { Router } from 'express';

// Importa os controladores
import { createOcorrencia, getOcorrencias, getRelatorio, getMapaCalor, getMinhasOcorrencias } from '../controllers/ocorrenciaController';
import { register, login } from '../controllers/authController';

// Importa os middlewares
import { authMiddleware } from '../middleware/authMiddleware';
import { validateLogin, validateRegister, validateOcorrencia } from '../middleware/validationMiddleware'; 

// Cria o router principal da API com um prefixo de versão, para manter a lógica de versionamento centralizada
const apiRouter = Router();

// Agrupa todas as rotas da versão 1
const v1Router = Router();

// --- Rotas Públicas (sem autenticação) ---
v1Router.post('/register', validateRegister, register);
v1Router.post('/login', validateLogin, login);
v1Router.get('/mapa-calor', getMapaCalor);

// --- Rotas Protegidas (com autenticação) ---
// O middleware de autenticação é aplicado a todas as rotas que vêm depois desta linha
v1Router.use(authMiddleware);

// Rotas de Ocorrências
v1Router.post('/ocorrencias', validateOcorrencia, createOcorrencia);
v1Router.get('/ocorrencias', getOcorrencias);
v1Router.get('/ocorrencias/minhas', getMinhasOcorrencias)

// Rotas de Relatórios e Análises
v1Router.get('/relatorio', getRelatorio);

// Usa o router de versão no router principal
apiRouter.use('/v1', v1Router);

export default apiRouter;