// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// A chave secreta é carregada das variáveis de ambiente.
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_super_secret_key';

/**
 * @route POST /api/v1/register
 * @desc Registra um novo usuário no sistema.
 * A validação dos campos é feita pelo validationMiddleware.
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { nome, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    const newUser = new User({ nome, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário.', error });
  }
};

/**
 * @route POST /api/v1/login
 * @desc Autentica um usuário e retorna um token JWT.
 * A validação dos campos é feita pelo validationMiddleware.
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // O plugin `mongoose-bcrypt` adiciona o método comparePassword.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };
    
    if (typeof JWT_SECRET !== 'string') {
        throw new Error('A chave secreta JWT não está configurada corretamente.');
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};