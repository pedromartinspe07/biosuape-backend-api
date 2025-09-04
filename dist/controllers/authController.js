"use strict";
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
// A chave secreta é carregada das variáveis de ambiente.
const JWT_SECRET = process.env.JWT_SECRET || 'f56adae08b238399c78d163ea1ec0526e51dfd91aadae91cd461b04722f55554c647060943f3b6c0203b2caa8bdd078cfcd576b860802a643aa0ed3366631f21';
/**
 * @route POST /api/v1/register
 * @desc Registra um novo usuário no sistema.
 * A validação dos campos é feita pelo validationMiddleware.
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Este e-mail já está em uso.' });
        }
        const newUser = new User_1.default({ nome, email, password });
        yield newUser.save();
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário.', error });
    }
});
exports.register = register;
/**
 * @route POST /api/v1/login
 * @desc Autentica um usuário e retorna um token JWT.
 * A validação dos campos é feita pelo validationMiddleware.
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        // O plugin `mongoose-bcrypt` adiciona o método comparePassword.
        const isMatch = yield user.comparePassword(password);
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
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});
exports.login = login;
