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
const JWT_SECRET: Secret = process.env.JWT_SECRET || '9eebcc594b55de2cb61907cecedde68733686119e573a77d46f13c687485b48d883b0e02ad5e0e6693699f586259da84264979676a1e10d09a1fbde0eb36ddd2';

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
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Token de autenticação expirado.' });
    }
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ message: 'Token de autenticação inválido.' });
    }
    return res.status(500).json({ message: 'Erro na autenticação.' });
  }
};