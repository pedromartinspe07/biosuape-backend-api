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
exports.deleteRelatorio = exports.updateRelatorio = exports.getRelatorioById = exports.getRelatorios = exports.createRelatorio = void 0;
const Relatorio_1 = __importDefault(require("../models/Relatorio"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @route POST /api/v1/relatorios
 * @desc Cria um novo relatório.
 * @access Private
 */
const createRelatorio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { titulo, descricao, dados } = req.body;
        const novoRelatorio = new Relatorio_1.default({
            titulo,
            descricao,
            dados,
        });
        yield novoRelatorio.save();
        return res.status(201).json(novoRelatorio);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Erro ao criar relatório:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao criar o relatório.' });
    }
});
exports.createRelatorio = createRelatorio;
/**
 * @route GET /api/v1/relatorios
 * @desc Obtém todos os relatórios com suporte a paginação.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 */
const getRelatorios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const relatorios = yield Relatorio_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalRelatorios = yield Relatorio_1.default.countDocuments();
        const totalPages = Math.ceil(totalRelatorios / limit);
        return res.status(200).json({
            data: relatorios,
            page,
            limit,
            totalPages,
            totalRelatorios,
        });
    }
    catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar relatórios.' });
    }
});
exports.getRelatorios = getRelatorios;
/**
 * @route GET /api/v1/relatorios/:id
 * @desc Obtém um relatório específico pelo ID.
 * @access Public
 */
const getRelatorioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const relatorio = yield Relatorio_1.default.findById(id);
        if (!relatorio) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }
        return res.status(200).json(relatorio);
    }
    catch (error) {
        console.error('Erro ao buscar relatório por ID:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar relatório.' });
    }
});
exports.getRelatorioById = getRelatorioById;
/**
 * @route PUT /api/v1/relatorios/:id
 * @desc Atualiza um relatório existente.
 * @access Private
 */
const updateRelatorio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const relatorioAtualizado = yield Relatorio_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // Retorna o documento atualizado
            runValidators: true, // Executa as validações do schema
        });
        if (!relatorioAtualizado) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }
        return res.status(200).json(relatorioAtualizado);
    }
    catch (error) {
        console.error('Erro ao atualizar relatório:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o relatório.' });
    }
});
exports.updateRelatorio = updateRelatorio;
/**
 * @route DELETE /api/v1/relatorios/:id
 * @desc Deleta um relatório existente.
 * @access Private
 */
const deleteRelatorio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const relatorioDeletado = yield Relatorio_1.default.findByIdAndDelete(id);
        if (!relatorioDeletado) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }
        return res.status(200).json({ message: 'Relatório deletado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao deletar relatório:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao deletar o relatório.' });
    }
});
exports.deleteRelatorio = deleteRelatorio;
