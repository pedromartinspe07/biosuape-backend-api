// src/routes/api.ts
import { Router } from 'express';
import { createOcorrencia, getOcorrencias, getRelatorio, getMapaCalor } from '../controllers/ocorrenciaController';
import { register, login } from '../controllers/authController'; // Importe os novos controladores
import { authMiddleware } from '../middleware/authMiddleware'; // Importe o middleware

const router = Router();

// --- Rotas de Autenticação ---
// POST /api/v1/register - Cadastro de novo usuário
router.post('/register', register);
// POST /api/v1/login - Login de usuário
router.post('/login', login);

// --- Rotas para Ocorrências ---
// POST /api/v1/ocorrencias - Cria uma nova ocorrência (agora protegida)
router.post('/ocorrencias', authMiddleware, createOcorrencia);
// GET /api/v1/ocorrencias - Obtém todas as ocorrências
router.get('/ocorrencias', getOcorrencias);

// --- Rotas para Relatórios e Análises ---
// GET /api/v1/relatorio - Gera um relatório estatístico de ocorrências (agora protegida)
router.get('/relatorio', authMiddleware, getRelatorio);
// GET /api/v1/mapa-calor - Obtém dados para um mapa de calor
router.get('/mapa-calor', getMapaCalor);

export default router;