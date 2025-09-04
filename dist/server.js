"use strict";
// src/server.ts
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const api_1 = __importDefault(require("./routes/api"));
const db_1 = __importDefault(require("./config/db"));
const AppError_1 = require("./utils/AppError"); // Classe de erro personalizada
// Carrega as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// --- Configuração e Middlewares de Segurança ---
// Habilita o CORS para permitir requisições de outras origens
app.use((0, cors_1.default)());
// Adiciona o middleware Helmet para segurança HTTP
app.use((0, helmet_1.default)());
// Analisa o corpo da requisição em JSON
app.use(express_1.default.json());
// Logger de requisições, útil para depuração
if (NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// --- Rotas da API ---
// As rotas da API são prefixadas com /api para clareza e versionamento
app.use('/api', api_1.default);
// --- Tratamento de Erros ---
// Middleware para lidar com rotas não encontradas (404)
app.use((req, res, next) => {
    const error = new AppError_1.AppError('A rota solicitada não foi encontrada.', 404);
    next(error);
});
// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    // Define o status do erro (padrão 500) e a mensagem
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';
    // Loga o erro completo em ambiente de desenvolvimento
    if (NODE_ENV === 'development') {
        console.error(`Status: ${statusCode}, Mensagem: ${message}`);
        console.error(err.stack);
    }
    // Envia a resposta de erro ao cliente
    res.status(statusCode).json(Object.assign({ status: 'error', message: message }, (NODE_ENV === 'development' && { stack: err.stack })));
});
// --- Inicialização do Servidor ---
// Função assíncrona para conectar ao banco de dados e iniciar o servidor
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Conecta ao MongoDB antes de iniciar o servidor
        yield (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`Servidor rodando em ambiente de ${NODE_ENV} na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('Falha ao iniciar o servidor:', error);
        process.exit(1); // Encerra o processo se a conexão falhar
    }
});
startServer();
