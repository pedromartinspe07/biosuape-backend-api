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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
// Variáveis de ambiente
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas da API
app.use('/api/v1', api_1.default);
// Tratamento de rotas não encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada.' });
});
// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack); // Loga o stack trace do erro no console do servidor
    // Constrói a resposta de erro com base no ambiente
    const errorResponse = Object.assign({ message: 'Algo deu errado no servidor!' }, (NODE_ENV === 'development' && { error: err.stack }));
    res.status(500).json(errorResponse);
});
// Iniciar o servidor somente após a conexão com o banco de dados
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`Servidor rodando em ambiente de ${NODE_ENV} na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
});
startServer();
