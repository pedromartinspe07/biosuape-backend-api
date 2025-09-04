// src/controllers/bioindicadorController.ts

import { Request, Response, NextFunction } from 'express';
import Bioindicador from '../models/Bioindicador';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

/**
 * @route POST /api/v1/bioindicadores
 * @desc Cria um novo bioindicador.
 * @access Private (apenas para admins)
 */
export const createBioindicador = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // A validação de `admin` será feita por um middleware de autorização separado.
    try {
        const novoBioindicador = new Bioindicador(req.body);
        const bioindicadorSalvo = await novoBioindicador.save();
        res.status(201).json(bioindicadorSalvo);

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return next(new AppError(error.message, 400));
        }
        next(error); // Passa outros erros para o middleware de erro global
    }
};

/**
 * @route GET /api/v1/bioindicadores
 * @desc Obtém todos os bioindicadores com paginação e busca por nome.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 * @query {string} search - Termo de busca para nome popular ou científico.
 */
export const getBioindicadores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search as string;

    const filter: any = {};
    if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i'); // 'i' para case-insensitive
        filter.$or = [
            { nomePopular: regex },
            { nomeCientifico: regex },
        ];
    }

    try {
        const bioindicadores = await Bioindicador.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ nomePopular: 1 });

        const totalBioindicadores = await Bioindicador.countDocuments(filter);
        const totalPages = Math.ceil(totalBioindicadores / limit);

        res.status(200).json({
            data: bioindicadores,
            page,
            limit,
            totalPages,
            totalBioindicadores,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/v1/bioindicadores/:id
 * @desc Obtém um bioindicador específico pelo ID.
 * @access Public
 */
export const getBioindicadorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const bioindicador = await Bioindicador.findById(id);
        if (!bioindicador) {
            return next(new AppError('Bioindicador não encontrado.', 404));
        }
        res.status(200).json(bioindicador);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return next(new AppError('ID do bioindicador inválido.', 400));
        }
        next(error);
    }
};

/**
 * @route PUT /api/v1/bioindicadores/:id
 * @desc Atualiza um bioindicador existente.
 * @access Private (apenas para admins)
 */
export const updateBioindicador = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const bioindicadorAtualizado = await Bioindicador.findByIdAndUpdate(id, req.body, {
            new: true, // Retorna o documento atualizado
            runValidators: true, // Executa as validações do schema
        });

        if (!bioindicadorAtualizado) {
            return next(new AppError('Bioindicador não encontrado.', 404));
        }
        res.status(200).json(bioindicadorAtualizado);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return next(new AppError('ID do bioindicador inválido.', 400));
        }
        next(error);
    }
};

/**
 * @route DELETE /api/v1/bioindicadores/:id
 * @desc Deleta um bioindicador existente.
 * @access Private (apenas para admins)
 */
export const deleteBioindicador = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const bioindicadorDeletado = await Bioindicador.findByIdAndDelete(id);
        if (!bioindicadorDeletado) {
            return next(new AppError('Bioindicador não encontrado.', 404));
        }
        res.status(204).end(); // Resposta 204 indica sucesso sem conteúdo
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return next(new AppError('ID do bioindicador inválido.', 400));
        }
        next(error);
    }
};