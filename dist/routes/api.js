"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/api.ts
const express_1 = require("express");
// Importa os controladores
const ocorrenciaController_1 = require("../controllers/ocorrenciaController");
const authController_1 = require("../controllers/authController");
// Importa os middlewares
const authMiddleware_1 = require("../middleware/authMiddleware");
// Importe o middleware de validação para usuário/login (você pode ter um arquivo como 'validateUser')
// import { validateUser } from '../middleware/validationMiddleware'; 
const apiRouter = (0, express_1.Router)();
// --- Rotas de Autenticação ---
// Sub-router para rotas de autenticação
const authRouter = (0, express_1.Router)();
// Rotas públicas (não precisam de token)
// Adicione o middleware de validação aqui se você tiver um.
authRouter.post('/register', authController_1.register);
authRouter.post('/login', authController_1.login);
// Anexa o sub-router ao router principal
apiRouter.use(authRouter);
// --- Rotas para Ocorrências ---
// Rotas que exigem autenticação
apiRouter.post('/ocorrencias', authMiddleware_1.authMiddleware, ocorrenciaController_1.createOcorrencia);
apiRouter.get('/ocorrencias', ocorrenciaController_1.getOcorrencias);
// --- Rotas para Relatórios e Análises ---
// Rotas que exigem autenticação
apiRouter.get('/relatorio', authMiddleware_1.authMiddleware, ocorrenciaController_1.getRelatorio);
apiRouter.get('/mapa-calor', ocorrenciaController_1.getMapaCalor);
exports.default = apiRouter;
