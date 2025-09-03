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
exports.getMapaCalor = exports.getRelatorio = exports.getOcorrencias = exports.createOcorrencia = void 0;
const Ocorrencia_1 = __importDefault(require("../models/Ocorrencia"));
/**
 * Cria uma nova ocorrência com base nos dados fornecidos na requisição.
 * Agora utiliza o ID do usuário do token de autenticação.
 */
const createOcorrencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // A validação de entrada agora é feita pelo validationMiddleware.
    const { bioindicadorId, latitude, longitude, observacoes, ph, temperaturaAgua, imagemUrl } = req.body;
    const user = req.user;
    const usuarioId = user.id;
    try {
        const novaOcorrencia = new Ocorrencia_1.default({
            usuarioId,
            bioindicadorId,
            latitude,
            longitude,
            observacoes,
            ph,
            temperaturaAgua,
            imagemUrl,
        });
        yield novaOcorrencia.save();
        res.status(201).json(novaOcorrencia);
    }
    catch (error) {
        console.error('Erro ao criar ocorrência:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar a ocorrência.' });
    }
});
exports.createOcorrencia = createOcorrencia;
/**
 * Obtém todas as ocorrências com suporte opcional a paginação e filtros.
 * @param {Request} req - A requisição. Pode conter parâmetros de query 'page', 'limit' e 'bioindicadorId'.
 * @param {Response} res - A resposta.
 */
const getOcorrencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bioindicadorId = req.query.bioindicadorId;
    const query = {};
    if (bioindicadorId) {
        query.bioindicadorId = bioindicadorId;
    }
    try {
        const ocorrencias = yield Ocorrencia_1.default.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        const totalOcorrencias = yield Ocorrencia_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalOcorrencias / limit);
        res.status(200).json({
            data: ocorrencias,
            page,
            limit,
            totalPages,
            totalOcorrencias,
        });
    }
    catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar ocorrências.' });
    }
});
exports.getOcorrencias = getOcorrencias;
/**
 * Gera um relatório estatístico de ocorrências.
 * Atualmente retorna um esqueleto de dados agrupados por bioindicador.
 */
const getRelatorio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const relatorio = yield Ocorrencia_1.default.aggregate([
            {
                $group: {
                    _id: '$bioindicadorId',
                    count: { $sum: 1 },
                    avgPh: { $avg: '$ph' },
                    avgTemperaturaAgua: { $avg: '$temperaturaAgua' },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);
        res.status(200).json(relatorio);
    }
    catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao gerar relatório.' });
    }
});
exports.getRelatorio = getRelatorio;
/**
 * Retorna dados para um mapa de calor, agrupando ocorrências em uma grade de coordenadas.
 * A lógica é simplificada para fins de demonstração.
 */
const getMapaCalor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Exemplo de agregação para agrupar ocorrências por localização (simplificado)
        const heatmapData = yield Ocorrencia_1.default.aggregate([
            {
                $group: {
                    _id: {
                        lat: { $trunc: ['$latitude'] },
                        lon: { $trunc: ['$longitude'] },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(heatmapData);
    }
    catch (error) {
        console.error('Erro ao gerar dados para mapa de calor:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao gerar dados para mapa de calor.' });
    }
});
exports.getMapaCalor = getMapaCalor;
