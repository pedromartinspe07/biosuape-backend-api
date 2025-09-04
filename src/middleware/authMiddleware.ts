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
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'f56adae08b238399c78d163ea1ec0526e51dfd91aadae91cd461b04722f55554c647060943f3b6c0203b2caa8bdd078cfcd576b860802a643aa0ed3366631f21';

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