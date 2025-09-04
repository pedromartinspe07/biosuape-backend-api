"use strict";
// src/routes/api.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Importa os controladores
const ocorrenciaController_1 = require("../controllers/ocorrenciaController");
const authController_1 = require("../controllers/authController");
// Importa os middlewares
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
// Cria o router principal da API com um prefixo de versão
const apiRouter = (0, express_1.Router)();
// --- Rotas Públicas (sem autenticação) ---
// Perfeito para endpoints de login e registro
apiRouter.post('/v1/register', validationMiddleware_1.validateRegister, authController_1.register);
apiRouter.post('/v1/login', validationMiddleware_1.validateLogin, authController_1.login);
// O endpoint de mapa de calor pode ser público, pois não expõe dados sensíveis do usuário
apiRouter.get('/v1/mapa-calor', ocorrenciaController_1.getMapaCalor);
// --- Rotas Protegidas (com autenticação) ---
// Use o middleware de autenticação para proteger todas as rotas abaixo
apiRouter.use('/v1', authMiddleware_1.authMiddleware);
// Rotas de Ocorrências
apiRouter.post('/v1/ocorrencias', validationMiddleware_1.validateOcorrencia, ocorrenciaController_1.createOcorrencia);
apiRouter.get('/v1/ocorrencias', ocorrenciaController_1.getOcorrencias);
// Rotas de Relatórios e Análises
apiRouter.get('/v1/relatorio', ocorrenciaController_1.getRelatorio);
exports.default = apiRouter;
