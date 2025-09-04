"use strict";
// src/middleware/authMiddleware.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError"); // Importa a classe de erro personalizada
// =======================
// CHAVE SECRETA DO JWT
// =======================
const JWT_SECRET = process.env.JWT_SECRET;
// Garante que a chave secreta JWT esteja configurada no ambiente.
if (!JWT_SECRET) {
    console.error('ERRO: Variável de ambiente JWT_SECRET não está definida.');
    process.exit(1); // Encerra a aplicação se a chave não estiver presente
}
// =======================
// MIDDLEWARE DE AUTENTICAÇÃO
// =======================
/**
 * Middleware para autenticação de token JWT.
 * * 1. Verifica se o token está presente no cabeçalho 'Authorization'.
 * 2. Valida o token e extrai o payload.
 * 3. Anexa os dados do usuário à requisição para uso posterior nos controladores.
 * 4. Lida com erros de token, como expiração ou invalidade.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Verifica se o cabeçalho 'Authorization' existe e se está no formato 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError_1.AppError('Token de autenticação não fornecido ou formato inválido.', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // Adiciona o payload decodificado à requisição
        next();
    }
    catch (err) {
        // Lida com erros de validação do token e envia uma resposta 401
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            return next(new AppError_1.AppError('Token de autenticação expirado.', 401));
        }
        else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return next(new AppError_1.AppError('Token de autenticação inválido.', 401));
        }
        else {
            // Erro genérico
            return next(new AppError_1.AppError('Erro na autenticação.', 401));
        }
    }
};
exports.authMiddleware = authMiddleware;
