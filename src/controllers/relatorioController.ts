// src/controllers/relatorioController.ts

import { Request, Response, NextFunction } from 'express';
import Relatorio from '../models/Relatorio';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

/**
 * @route POST /api/v1/relatorios
 * @desc Cria um novo relatório para o usuário logado.
 * @access Private
 */
export const createRelatorio = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { titulo, descricao, dados } = req.body;
        const usuarioId = req.user?.id;

        if (!usuarioId) {
            return next(new AppError('Usuário não autenticado.', 401));
        }

        const novoRelatorio = new Relatorio({
            titulo,
            descricao,
            dados,
            usuarioId,
        });

        const relatorioSalvo = await novoRelatorio.save();
        res.status(201).json(relatorioSalvo);

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return next(new AppError(error.message, 400));
        }
        next(error); // Passa outros erros para o middleware de erro global
    }
};

/**
 * @route GET /api/v1/relatorios
 * @desc Obtém todos os relatórios com paginação e busca por título/descrição.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 * @query {string} search - Termo de busca para título ou descrição.
 */
export const getRelatorios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search as string;

    const filter: any = {};
    if (searchQuery) {
        filter.$or = [
            { titulo: { $regex: searchQuery, $options: 'i' } },
            { descricao: { $regex: searchQuery, $options: 'i' } },
        ];
    }

    try {
        const relatorios = await Relatorio.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalRelatorios = await Relatorio.countDocuments(filter);
        const totalPages = Math.ceil(totalRelatorios / limit);

        res.status(200).json({
            data: relatorios,
            page,
            limit,
            totalPages,
            totalRelatorios,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/v1/relatorios/:id
 * @desc Obtém um relatório específico pelo ID.
 * @access Public
 */
export const getRelatorioById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const relatorio = await Relatorio.findById(id);

        if (!relatorio) {
            return next(new AppError('Relatório não encontrado.', 404));
        }

        res.status(200).json(relatorio);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return next(new AppError('ID do relatório inválido.', 400));
        }
        next(error);
    }
};

/**
 * @route PUT /api/v1/relatorios/:id
 * @desc Atualiza um relatório existente, permitindo apenas ao criador.
 * @access Private
 */
export const updateRelatorio = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const usuarioId = req.user?.id;

    try {
        const relatorio = await Relatorio.findById(id);

        if (!relatorio) {
            return next(new AppError('Relatório não encontrado.', 404));
        }

        // Verifica se o usuário logado é o proprietário do relatório
        if (relatorio.usuarioId.toString() !== usuarioId) {
            return next(new AppError('Você não tem permissão para atualizar este relatório.', 403));
        }

        const relatorioAtualizado = await Relatorio.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(relatorioAtualizado);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return next(new AppError('ID do relatório inválido.', 400));
        }
        next(error);
    }
};

/**
 * @route DELETE /api/v1/relatorios/:id
 * @desc Deleta um relatório existente, permitindo apenas ao criador.
 * @access Private
 */
export const deleteRelatorio = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const usuarioId = req.user?.id;

    try {
        const relatorio = await Relatorio.findById(id);

        if (!relatorio) {
            return next(new AppError('Relatório não encontrado.', 404));
        }

        // Verifica se o usuário logado é o proprietário do relatório
        if (relatorio.usuarioId.toString() !== usuarioId) {
            return next(new AppError('Você não tem permissão para deletar este relatório.', 403));
        }

        await Relatorio.findByIdAndDelete(id);

        res.status(204).end(); // Resposta 204 indica sucesso sem conteúdo
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return next(new AppError('ID do relatório inválido.', 400));
        }
        next(error);
    }
};