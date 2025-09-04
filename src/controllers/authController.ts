// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User, { IUser, UserModel } from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// A chave secreta deve ser carregada das variáveis de ambiente.
// Use um valor de fallback apenas para desenvolvimento local.
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'f56adae08b238399c78d163ea1ec0526e51dfd91aadae91cd461b04722f55554c647060943f3b6c0203b2caa8bdd078cfcd576b860802a643aa0ed3366631f21';

/**
 * @route POST /api/v1/register
 * @desc Registra um novo usuário no sistema.
 * @param req A requisição com os dados de nome, email e senha.
 * @param res A resposta HTTP.
 * @returns Resposta JSON com a mensagem de sucesso ou erro.
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { nome, email, password } = req.body;

  try {
    // A validação de campos vazios deve ser feita por um middleware, como `express-validator`.
    const existingUser = await (User as UserModel).findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    const newUser = new User({ nome, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * @route POST /api/v1/login
 * @desc Autentica um usuário e retorna um token JWT.
 * @param req A requisição com os dados de email e senha.
 * @param res A resposta HTTP.
 * @returns Resposta JSON com o token de autenticação em caso de sucesso.
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // Busca o usuário e seleciona o campo 'password' para comparação.
    const user = await (User as UserModel).findByEmail(email, true);

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // A função comparePassword agora é um método de instância do modelo, conforme atualizado.
    const isMatch = await (user as IUser).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Cria o payload do JWT com os dados do usuário.
    const payload = {
      id: user._id,
      email: user.email,
    };

    if (typeof JWT_SECRET !== 'string' || JWT_SECRET === 'fallback_secret_development') {
      throw new Error('A chave secreta JWT não está configurada corretamente.');
    }

    // Assina o token com a chave secreta e define um tempo de expiração.
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};