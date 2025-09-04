"use strict";
// src/controllers/authController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = require("../utils/AppError");
// A chave secreta deve ser carregada das variáveis de ambiente.
const JWT_SECRET = process.env.JWT_SECRET;
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
const signToken = (id, email) => {
    return jsonwebtoken_1.default.sign({ id, email }, JWT_SECRET, {
        expiresIn: '1d',
    });
};
/**
 * @route POST /api/v1/register
 * @desc Registra um novo usuário no sistema.
 * @access Public
 */
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, password } = req.body;
    try {
        // Validação de e-mail duplicado
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return next(new AppError_1.AppError('Este e-mail já está em uso.', 409));
        }
        const newUser = new User_1.default({ nome, email, password });
        yield newUser.save();
        const token = signToken(newUser._id.toString(), newUser.email);
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            token,
            user: {
                id: newUser._id,
                nome: newUser.nome,
                email: newUser.email,
            }
        });
    }
    catch (error) {
        next(error); // Passa o erro para o middleware de erro global.
    }
});
exports.register = register;
/**
 * @route POST /api/v1/login
 * @desc Autentica um usuário e retorna um token JWT.
 * @access Public
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Busca o usuário e seleciona o campo 'password' para comparação.
        const user = yield User_1.default.findByEmail(email, true);
        if (!user || !(yield user.comparePassword(password))) {
            return next(new AppError_1.AppError('Credenciais inválidas.', 401));
        }
        const token = signToken(user._id.toString(), user.email);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
            }
        });
    }
    catch (error) {
        next(error); // Passa o erro para o middleware de erro global.
    }
});
exports.login = login;
