// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

// Payload do JWT
export interface AuthPayload extends JwtPayload {
  id: string;
  email: string;
}

// Interface de request autenticada
export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

// Chave secreta
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_super_secret_key';

/**
 * Middleware para autenticação de token JWT.
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    let message = 'Erro na autenticação.';
    if (err instanceof TokenExpiredError) {
      message = 'Token de autenticação expirado.';
    } else if (err instanceof JsonWebTokenError) {
      message = 'Token de autenticação inválido.';
    }

    return res.status(401).json({ message });
  }
};