"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/api.ts
const express_1 = require("express");
const ocorrenciaController_1 = require("../controllers/ocorrenciaController");
const authController_1 = require("../controllers/authController"); // Importe os novos controladores
const authMiddleware_1 = require("../middleware/authMiddleware"); // Importe o middleware
const router = (0, express_1.Router)();
// --- Rotas de Autenticação ---
// POST /api/v1/register - Cadastro de novo usuário
router.post('/register', authController_1.register);
// POST /api/v1/login - Login de usuário
router.post('/login', authController_1.login);
// --- Rotas para Ocorrências ---
// POST /api/v1/ocorrencias - Cria uma nova ocorrência (agora protegida)
router.post('/ocorrencias', authMiddleware_1.authMiddleware, ocorrenciaController_1.createOcorrencia);
// GET /api/v1/ocorrencias - Obtém todas as ocorrências
router.get('/ocorrencias', ocorrenciaController_1.getOcorrencias);
// --- Rotas para Relatórios e Análises ---
// GET /api/v1/relatorio - Gera um relatório estatístico de ocorrências (agora protegida)
router.get('/relatorio', authMiddleware_1.authMiddleware, ocorrenciaController_1.getRelatorio);
// GET /api/v1/mapa-calor - Obtém dados para um mapa de calor
router.get('/mapa-calor', ocorrenciaController_1.getMapaCalor);
exports.default = router;
