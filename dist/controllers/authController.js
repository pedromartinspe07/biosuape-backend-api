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
const secret = process.env.JWT_SECRET || '9eebcc594b55de2cb61907cecedde68733686119e573a77d46f13c687485b48d883b0e02ad5e0e6693699f586259da84264979676a1e10d09a1fbde0eb36ddd2';
// Cadastro de usuário
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ajustado para 'username' e 'password' para coincidir com o frontend
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }
        // Agora o modelo User receberá as variáveis corretas.
        const newUser = new User_1.default({ nome: username, email, password });
        yield newUser.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário.', error });
    }
});
exports.register = register;
// Login de usuário
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ajustado para 'password' para coincidir com o frontend
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        // A função comparePassword agora recebe a variável correta.
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const payload = {
            id: user._id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1d' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login.', error });
    }
});
exports.login = login;
