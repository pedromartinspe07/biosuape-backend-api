// src/controllers/relatorioController.ts
import { Request, Response } from 'express';
import Relatorio from '../models/Relatorio';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

/**
 * @route POST /api/v1/relatorios
 * @desc Cria um novo relatório.
 * @access Private
 */
export const createRelatorio = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const { titulo, descricao, dados } = req.body;
        const novoRelatorio = new Relatorio({
            titulo,
            descricao,
            dados,
        });

        await novoRelatorio.save();
        return res.status(201).json(novoRelatorio);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Erro ao criar relatório:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao criar o relatório.' });
    }
};

/**
 * @route GET /api/v1/relatorios
 * @desc Obtém todos os relatórios com suporte a paginação.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 */
export const getRelatorios = async (req: Request, res: Response): Promise<Response> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const relatorios = await Relatorio.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalRelatorios = await Relatorio.countDocuments();
        const totalPages = Math.ceil(totalRelatorios / limit);

        return res.status(200).json({
            data: relatorios,
            page,
            limit,
            totalPages,
            totalRelatorios,
        });
    } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar relatórios.' });
    }
};

/**
 * @route GET /api/v1/relatorios/:id
 * @desc Obtém um relatório específico pelo ID.
 * @access Public
 */
export const getRelatorioById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const relatorio = await Relatorio.findById(id);
        if (!relatorio) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }
        return res.status(200).json(relatorio);
    } catch (error) {
        console.error('Erro ao buscar relatório por ID:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar relatório.' });
    }
};

/**
 * @route PUT /api/v1/relatorios/:id
 * @desc Atualiza um relatório existente.
 * @access Private
 */
export const updateRelatorio = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const relatorioAtualizado = await Relatorio.findByIdAndUpdate(id, req.body, {
            new: true, // Retorna o documento atualizado
            runValidators: true, // Executa as validações do schema
        });

        if (!relatorioAtualizado) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }
        return res.status(200).json(relatorioAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar relatório:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o relatório.' });
    }
};

/**
 * @route DELETE /api/v1/relatorios/:id
 * @desc Deleta um relatório existente.
 * @access Private
 */
export const deleteRelatorio = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const relatorioDeletado = await Relatorio.findByIdAndDelete(id);
        if (!relatorioDeletado) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }
        return res.status(200).json({ message: 'Relatório deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar relatório:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao deletar o relatório.' });
    }
};