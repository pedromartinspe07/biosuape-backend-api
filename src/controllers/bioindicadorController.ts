// src/controllers/bioindicadorController.ts
import { Request, Response } from 'express';
import Bioindicador from '../models/Bioindicador';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

/**
 * @route POST /api/v1/bioindicadores
 * @desc Cria um novo bioindicador.
 * @access Private
 */
export const createBioindicador = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const { nomePopular, nomeCientifico, descricao, funcaoBioindicadora, imageUrl } = req.body;
        const novoBioindicador = new Bioindicador({
            nomePopular,
            nomeCientifico,
            descricao,
            funcaoBioindicadora,
            imageUrl,
        });

        await novoBioindicador.save();
        return res.status(201).json(novoBioindicador);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Erro ao criar bioindicador:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao criar o bioindicador.' });
    }
};

/**
 * @route GET /api/v1/bioindicadores
 * @desc Obtém todos os bioindicadores com suporte a paginação.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 */
export const getBioindicadores = async (req: Request, res: Response): Promise<Response> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const bioindicadores = await Bioindicador.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalBioindicadores = await Bioindicador.countDocuments();
        const totalPages = Math.ceil(totalBioindicadores / limit);

        return res.status(200).json({
            data: bioindicadores,
            page,
            limit,
            totalPages,
            totalBioindicadores,
        });
    } catch (error) {
        console.error('Erro ao buscar bioindicadores:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar bioindicadores.' });
    }
};

/**
 * @route GET /api/v1/bioindicadores/:id
 * @desc Obtém um bioindicador específico pelo ID.
 * @access Public
 */
export const getBioindicadorById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const bioindicador = await Bioindicador.findById(id);
        if (!bioindicador) {
            return res.status(404).json({ message: 'Bioindicador não encontrado.' });
        }
        return res.status(200).json(bioindicador);
    } catch (error) {
        console.error('Erro ao buscar bioindicador por ID:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar bioindicador.' });
    }
};

/**
 * @route PUT /api/v1/bioindicadores/:id
 * @desc Atualiza um bioindicador existente.
 * @access Private
 */
export const updateBioindicador = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const bioindicadorAtualizado = await Bioindicador.findByIdAndUpdate(id, req.body, {
            new: true, // Retorna o documento atualizado
            runValidators: true, // Executa as validações do schema
        });

        if (!bioindicadorAtualizado) {
            return res.status(404).json({ message: 'Bioindicador não encontrado.' });
        }
        return res.status(200).json(bioindicadorAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar bioindicador:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o bioindicador.' });
    }
};

/**
 * @route DELETE /api/v1/bioindicadores/:id
 * @desc Deleta um bioindicador existente.
 * @access Private
 */
export const deleteBioindicador = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const bioindicadorDeletado = await Bioindicador.findByIdAndDelete(id);
        if (!bioindicadorDeletado) {
            return res.status(404).json({ message: 'Bioindicador não encontrado.' });
        }
        return res.status(200).json({ message: 'Bioindicador deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar bioindicador:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao deletar o bioindicador.' });
    }
};