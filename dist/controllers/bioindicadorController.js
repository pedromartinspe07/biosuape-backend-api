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
exports.deleteBioindicador = exports.updateBioindicador = exports.getBioindicadorById = exports.getBioindicadores = exports.createBioindicador = void 0;
const Bioindicador_1 = __importDefault(require("../models/Bioindicador"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @route POST /api/v1/bioindicadores
 * @desc Cria um novo bioindicador.
 * @access Private
 */
const createBioindicador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nomePopular, nomeCientifico, descricao, funcaoBioindicadora, imageUrl } = req.body;
        const novoBioindicador = new Bioindicador_1.default({
            nomePopular,
            nomeCientifico,
            descricao,
            funcaoBioindicadora,
            imageUrl,
        });
        yield novoBioindicador.save();
        return res.status(201).json(novoBioindicador);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Erro ao criar bioindicador:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao criar o bioindicador.' });
    }
});
exports.createBioindicador = createBioindicador;
/**
 * @route GET /api/v1/bioindicadores
 * @desc Obtém todos os bioindicadores com suporte a paginação.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 */
const getBioindicadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const bioindicadores = yield Bioindicador_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalBioindicadores = yield Bioindicador_1.default.countDocuments();
        const totalPages = Math.ceil(totalBioindicadores / limit);
        return res.status(200).json({
            data: bioindicadores,
            page,
            limit,
            totalPages,
            totalBioindicadores,
        });
    }
    catch (error) {
        console.error('Erro ao buscar bioindicadores:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar bioindicadores.' });
    }
});
exports.getBioindicadores = getBioindicadores;
/**
 * @route GET /api/v1/bioindicadores/:id
 * @desc Obtém um bioindicador específico pelo ID.
 * @access Public
 */
const getBioindicadorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bioindicador = yield Bioindicador_1.default.findById(id);
        if (!bioindicador) {
            return res.status(404).json({ message: 'Bioindicador não encontrado.' });
        }
        return res.status(200).json(bioindicador);
    }
    catch (error) {
        console.error('Erro ao buscar bioindicador por ID:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar bioindicador.' });
    }
});
exports.getBioindicadorById = getBioindicadorById;
/**
 * @route PUT /api/v1/bioindicadores/:id
 * @desc Atualiza um bioindicador existente.
 * @access Private
 */
const updateBioindicador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bioindicadorAtualizado = yield Bioindicador_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // Retorna o documento atualizado
            runValidators: true, // Executa as validações do schema
        });
        if (!bioindicadorAtualizado) {
            return res.status(404).json({ message: 'Bioindicador não encontrado.' });
        }
        return res.status(200).json(bioindicadorAtualizado);
    }
    catch (error) {
        console.error('Erro ao atualizar bioindicador:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o bioindicador.' });
    }
});
exports.updateBioindicador = updateBioindicador;
/**
 * @route DELETE /api/v1/bioindicadores/:id
 * @desc Deleta um bioindicador existente.
 * @access Private
 */
const deleteBioindicador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bioindicadorDeletado = yield Bioindicador_1.default.findByIdAndDelete(id);
        if (!bioindicadorDeletado) {
            return res.status(404).json({ message: 'Bioindicador não encontrado.' });
        }
        return res.status(200).json({ message: 'Bioindicador deletado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao deletar bioindicador:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao deletar o bioindicador.' });
    }
});
exports.deleteBioindicador = deleteBioindicador;
