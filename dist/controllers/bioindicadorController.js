"use strict";
// src/controllers/bioindicadorController.ts
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
exports.deleteBioindicador = exports.updateBioindicador = exports.getBioindicadorById = exports.getBioindicadores = exports.createBioindicador = void 0;
const Bioindicador_1 = __importDefault(require("../models/Bioindicador"));
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @route POST /api/v1/bioindicadores
 * @desc Cria um novo bioindicador.
 * @access Private (apenas para admins)
 */
const createBioindicador = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // A validação de `admin` será feita por um middleware de autorização separado.
    try {
        const novoBioindicador = new Bioindicador_1.default(req.body);
        const bioindicadorSalvo = yield novoBioindicador.save();
        res.status(201).json(bioindicadorSalvo);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return next(new AppError_1.AppError(error.message, 400));
        }
        next(error); // Passa outros erros para o middleware de erro global
    }
});
exports.createBioindicador = createBioindicador;
/**
 * @route GET /api/v1/bioindicadores
 * @desc Obtém todos os bioindicadores com paginação e busca por nome.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 * @query {string} search - Termo de busca para nome popular ou científico.
 */
const getBioindicadores = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search;
    const filter = {};
    if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i'); // 'i' para case-insensitive
        filter.$or = [
            { nomePopular: regex },
            { nomeCientifico: regex },
        ];
    }
    try {
        const bioindicadores = yield Bioindicador_1.default.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ nomePopular: 1 });
        const totalBioindicadores = yield Bioindicador_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalBioindicadores / limit);
        res.status(200).json({
            data: bioindicadores,
            page,
            limit,
            totalPages,
            totalBioindicadores,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBioindicadores = getBioindicadores;
/**
 * @route GET /api/v1/bioindicadores/:id
 * @desc Obtém um bioindicador específico pelo ID.
 * @access Public
 */
const getBioindicadorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bioindicador = yield Bioindicador_1.default.findById(id);
        if (!bioindicador) {
            return next(new AppError_1.AppError('Bioindicador não encontrado.', 404));
        }
        res.status(200).json(bioindicador);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return next(new AppError_1.AppError('ID do bioindicador inválido.', 400));
        }
        next(error);
    }
});
exports.getBioindicadorById = getBioindicadorById;
/**
 * @route PUT /api/v1/bioindicadores/:id
 * @desc Atualiza um bioindicador existente.
 * @access Private (apenas para admins)
 */
const updateBioindicador = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bioindicadorAtualizado = yield Bioindicador_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // Retorna o documento atualizado
            runValidators: true, // Executa as validações do schema
        });
        if (!bioindicadorAtualizado) {
            return next(new AppError_1.AppError('Bioindicador não encontrado.', 404));
        }
        res.status(200).json(bioindicadorAtualizado);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return next(new AppError_1.AppError('ID do bioindicador inválido.', 400));
        }
        next(error);
    }
});
exports.updateBioindicador = updateBioindicador;
/**
 * @route DELETE /api/v1/bioindicadores/:id
 * @desc Deleta um bioindicador existente.
 * @access Private (apenas para admins)
 */
const deleteBioindicador = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bioindicadorDeletado = yield Bioindicador_1.default.findByIdAndDelete(id);
        if (!bioindicadorDeletado) {
            return next(new AppError_1.AppError('Bioindicador não encontrado.', 404));
        }
        res.status(204).end(); // Resposta 204 indica sucesso sem conteúdo
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return next(new AppError_1.AppError('ID do bioindicador inválido.', 400));
        }
        next(error);
    }
});
exports.deleteBioindicador = deleteBioindicador;
