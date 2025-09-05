// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { AppError } from '../utils/AppError'; // Importa a classe de erro personalizada

// =======================
// INTERFACES E TIPAGEM
// =======================

/**
 * Interface do payload do token JWT, contendo informações do usuário.
 */
export interface AuthPayload extends JwtPayload {
  id: string;
  email: string;
}

/**
 * Estende a interface de Request do Express para incluir a propriedade 'user'.
 * Isso nos permite acessar os dados do usuário em rotas protegidas.
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

// =======================
// CHAVE SECRETA DO JWT
// =======================

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

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
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho 'Authorization' existe e se está no formato 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação não fornecido ou formato inválido.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded; // Adiciona o payload decodificado à requisição
    next();
  } catch (err) {
    // Adiciona log para depuração mais detalhada
    if (err instanceof Error) {
        console.error(`Erro de validação do token: ${err.message}`);
    }
    
    // Lida com erros de validação do token e envia uma resposta 401
    if (err instanceof TokenExpiredError) {
      return next(new AppError('Token de autenticação expirado.', 401));
    } else if (err instanceof JsonWebTokenError) {
      return next(new AppError('Token de autenticação inválido.', 401));
    } else {
      // Erros inesperados
      return next(new AppError('Erro interno ao validar o token.', 500));
    }
  }
};
