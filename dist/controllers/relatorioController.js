"use strict";
// src/controllers/relatorioController.ts
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
exports.deleteRelatorio = exports.updateRelatorio = exports.getRelatorioById = exports.getRelatorios = exports.createRelatorio = void 0;
const Relatorio_1 = __importDefault(require("../models/Relatorio"));
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @route POST /api/v1/relatorios
 * @desc Cria um novo relatório para o usuário logado.
 * @access Private
 */
const createRelatorio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { titulo, descricao, dados } = req.body;
        const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!usuarioId) {
            return next(new AppError_1.AppError('Usuário não autenticado.', 401));
        }
        const novoRelatorio = new Relatorio_1.default({
            titulo,
            descricao,
            dados,
            usuarioId,
        });
        const relatorioSalvo = yield novoRelatorio.save();
        res.status(201).json(relatorioSalvo);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return next(new AppError_1.AppError(error.message, 400));
        }
        next(error); // Passa outros erros para o middleware de erro global
    }
});
exports.createRelatorio = createRelatorio;
/**
 * @route GET /api/v1/relatorios
 * @desc Obtém todos os relatórios com paginação e busca por título/descrição.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 * @query {string} search - Termo de busca para título ou descrição.
 */
const getRelatorios = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search;
    const filter = {};
    if (searchQuery) {
        filter.$or = [
            { titulo: { $regex: searchQuery, $options: 'i' } },
            { descricao: { $regex: searchQuery, $options: 'i' } },
        ];
    }
    try {
        const relatorios = yield Relatorio_1.default.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalRelatorios = yield Relatorio_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalRelatorios / limit);
        res.status(200).json({
            data: relatorios,
            page,
            limit,
            totalPages,
            totalRelatorios,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRelatorios = getRelatorios;
/**
 * @route GET /api/v1/relatorios/:id
 * @desc Obtém um relatório específico pelo ID.
 * @access Public
 */
const getRelatorioById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const relatorio = yield Relatorio_1.default.findById(id);
        if (!relatorio) {
            return next(new AppError_1.AppError('Relatório não encontrado.', 404));
        }
        res.status(200).json(relatorio);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return next(new AppError_1.AppError('ID do relatório inválido.', 400));
        }
        next(error);
    }
});
exports.getRelatorioById = getRelatorioById;
/**
 * @route PUT /api/v1/relatorios/:id
 * @desc Atualiza um relatório existente, permitindo apenas ao criador.
 * @access Private
 */
const updateRelatorio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const relatorio = yield Relatorio_1.default.findById(id);
        if (!relatorio) {
            return next(new AppError_1.AppError('Relatório não encontrado.', 404));
        }
        // Verifica se o usuário logado é o proprietário do relatório
        if (relatorio.usuarioId.toString() !== usuarioId) {
            return next(new AppError_1.AppError('Você não tem permissão para atualizar este relatório.', 403));
        }
        const relatorioAtualizado = yield Relatorio_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(relatorioAtualizado);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return next(new AppError_1.AppError('ID do relatório inválido.', 400));
        }
        next(error);
    }
});
exports.updateRelatorio = updateRelatorio;
/**
 * @route DELETE /api/v1/relatorios/:id
 * @desc Deleta um relatório existente, permitindo apenas ao criador.
 * @access Private
 */
const deleteRelatorio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const relatorio = yield Relatorio_1.default.findById(id);
        if (!relatorio) {
            return next(new AppError_1.AppError('Relatório não encontrado.', 404));
        }
        // Verifica se o usuário logado é o proprietário do relatório
        if (relatorio.usuarioId.toString() !== usuarioId) {
            return next(new AppError_1.AppError('Você não tem permissão para deletar este relatório.', 403));
        }
        yield Relatorio_1.default.findByIdAndDelete(id);
        res.status(204).end(); // Resposta 204 indica sucesso sem conteúdo
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return next(new AppError_1.AppError('ID do relatório inválido.', 400));
        }
        next(error);
    }
});
exports.deleteRelatorio = deleteRelatorio;
