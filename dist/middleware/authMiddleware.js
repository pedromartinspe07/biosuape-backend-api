"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
// Chave secreta
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';
/**
 * Middleware para autenticação de token JWT.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido ou formato inválido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verifique se a JWT_SECRET é uma string, conforme a tipagem do 'jsonwebtoken'
        if (typeof JWT_SECRET !== 'string') {
            throw new Error('A chave secreta JWT não está configurada corretamente.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        let message = 'Erro na autenticação.';
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            message = 'Token de autenticação expirado.';
        }
        else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            message = 'Token de autenticação inválido.';
        }
        return res.status(401).json({ message });
    }
};
exports.authMiddleware = authMiddleware;
