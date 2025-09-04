// src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User, { IUser, UserModel } from '../models/User';
import { AppError } from '../utils/AppError';

// A chave secreta deve ser carregada das variáveis de ambiente.
const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

// Garante que a chave secreta JWT esteja configurada no ambiente.
if (!JWT_SECRET) {
    console.error('ERRO: Variável de ambiente JWT_SECRET não está definida.');
    // Isso deve ser tratado no server.ts para um erro mais explícito.
}

/**
 * Função utilitária para gerar um token JWT.
 * @param id O ID do usuário.
 * @param email O e-mail do usuário.
 * @returns O token JWT assinado.
 */
const signToken = (id: string, email: string): string => {
    return jwt.sign({ id, email }, JWT_SECRET, {
        expiresIn: '1d',
    });
};

/**
 * @route POST /api/v1/register
 * @desc Registra um novo usuário no sistema.
 * @access Public
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { nome, email, password } = req.body;

    try {
        // Validação de e-mail duplicado
        const existingUser = await (User as UserModel).findOne({ email });
        if (existingUser) {
            return next(new AppError('Este e-mail já está em uso.', 409));
        }

        const newUser = new User({ nome, email, password });
        await newUser.save();

        const token = signToken((newUser._id as string).toString(), newUser.email);

        res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso!', 
            token,
            user: {
                id: newUser._id,
                nome: newUser.nome,
                email: newUser.email,
            } 
        });

    } catch (error) {
        next(error); // Passa o erro para o middleware de erro global.
    }
};

/**
 * @route POST /api/v1/login
 * @desc Autentica um usuário e retorna um token JWT.
 * @access Public
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Busca o usuário e seleciona o campo 'password' para comparação.
        const user = await (User as UserModel).findByEmail(email, true);

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Credenciais inválidas.', 401));
        }

        const token = signToken((user._id as string).toString(), user.email);

        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
            }
        });
    } catch (error) {
        next(error); // Passa o erro para o middleware de erro global.
    }
};