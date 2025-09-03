// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const secret = process.env.JWT_SECRET || '9eebcc594b55de2cb61907cecedde68733686119e573a77d46f13c687485b48d883b0e02ad5e0e6693699f586259da84264979676a1e10d09a1fbde0eb36ddd2';

// Cadastro de usuário
export const register = async (req: Request, res: Response) => {
  // Ajustado para 'username' e 'password' para coincidir com o frontend
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Este email já está em uso.' });
    }

    // Agora o modelo User receberá as variáveis corretas.
    const newUser = new User({ nome: username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', error });
  }
};

// Login de usuário
export const login = async (req: Request, res: Response) => {
  // Ajustado para 'password' para coincidir com o frontend
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // A função comparePassword agora recebe a variável correta.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login.', error });
  }
};