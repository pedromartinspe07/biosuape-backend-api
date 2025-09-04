"use strict";
// src/controllers/ocorrenciaController.ts
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
exports.getMapaCalor = exports.getRelatorio = exports.getMinhasOcorrencias = exports.getOcorrencias = exports.createOcorrencia = void 0;
const Ocorrencia_1 = __importDefault(require("../models/Ocorrencia"));
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @route POST /api/v1/ocorrencias
 * @desc Cria uma nova ocorrência para o usuário logado.
 * @access Private
 */
const createOcorrencia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!usuarioId) {
        return next(new AppError_1.AppError('Usuário não autenticado.', 401));
    }
    try {
        const novaOcorrencia = new Ocorrencia_1.default(Object.assign(Object.assign({}, req.body), { usuarioId, dataHoraOcorrencia: req.body.dataHoraOcorrencia || new Date() }));
        yield novaOcorrencia.save();
        res.status(201).json(novaOcorrencia);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return next(new AppError_1.AppError(error.message, 400));
        }
        next(error);
    }
});
exports.createOcorrencia = createOcorrencia;
/**
 * @route GET /api/v1/ocorrencias
 * @desc Obtém todas as ocorrências com suporte a paginação e filtros.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 * @query {string} bioindicadorId - Filtra por ID do bioindicador.
 */
const getOcorrencias = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const bioindicadorId = req.query.bioindicadorId;
    const filter = {};
    if (bioindicadorId) {
        filter.bioindicadorId = bioindicadorId;
    }
    try {
        const ocorrencias = yield Ocorrencia_1.default.find(filter)
            .populate('bioindicadorId', 'nomePopular nomeCientifico') // Retorna os dados do bioindicador
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalOcorrencias = yield Ocorrencia_1.default.countDocuments(filter);
        res.status(200).json({
            data: ocorrencias,
            page,
            limit,
            totalOcorrencias,
            totalPages: Math.ceil(totalOcorrencias / limit),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getOcorrencias = getOcorrencias;
/**
 * @route GET /api/v1/ocorrencias/minhas
 * @desc Obtém todas as ocorrências do usuário logado.
 * @access Private
 */
const getMinhasOcorrencias = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!usuarioId) {
        return next(new AppError_1.AppError('Usuário não autenticado.', 401));
    }
    try {
        const minhasOcorrencias = yield Ocorrencia_1.default.find({ usuarioId })
            .populate('bioindicadorId', 'nomePopular nomeCientifico')
            .sort({ createdAt: -1 });
        res.status(200).json(minhasOcorrencias);
    }
    catch (error) {
        next(error);
    }
});
exports.getMinhasOcorrencias = getMinhasOcorrencias;
/**
 * @route GET /api/v1/relatorio
 * @desc Gera um relatório estatístico de ocorrências para o usuário logado.
 * @access Private
 */
const getRelatorio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!usuarioId) {
        return next(new AppError_1.AppError('Usuário não autenticado.', 401));
    }
    try {
        const relatorio = yield Ocorrencia_1.default.aggregate([
            { $match: { usuarioId: new mongoose_1.default.Types.ObjectId(usuarioId) } }, // Filtra por usuário logado
            {
                $group: {
                    _id: '$bioindicadorId',
                    count: { $sum: 1 },
                    avgPh: { $avg: '$ph' },
                    avgTemperaturaAgua: { $avg: '$temperaturaAgua' },
                },
            },
            {
                $lookup: {
                    from: 'bioindicadores',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bioindicador',
                },
            },
            { $unwind: '$bioindicador' }, // Desestrutura o array
            {
                $project: {
                    _id: 0,
                    bioindicadorId: '$_id',
                    nomePopular: '$bioindicador.nomePopular',
                    nomeCientifico: '$bioindicador.nomeCientifico',
                    count: 1,
                    avgPh: { $round: ['$avgPh', 2] },
                    avgTemperaturaAgua: { $round: ['$avgTemperaturaAgua', 2] },
                },
            },
            { $sort: { count: -1 } },
        ]);
        res.status(200).json(relatorio);
    }
    catch (error) {
        next(error);
    }
});
exports.getRelatorio = getRelatorio;
/**
 * @route GET /api/v1/mapa-calor
 * @desc Retorna dados para um mapa de calor.
 * @access Public
 */
const getMapaCalor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
            {
                $project: {
                    _id: 0,
                    lat: '$_id.lat',
                    lon: '$_id.lon',
                    count: 1,
                },
            },
            { $sort: { count: -1 } },
        ]);
        res.status(200).json(heatmapData);
    }
    catch (error) {
        next(error);
    }
});
exports.getMapaCalor = getMapaCalor;
