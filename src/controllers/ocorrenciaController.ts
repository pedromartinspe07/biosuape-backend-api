// src/controllers/ocorrenciaController.ts

import { Request, Response, NextFunction } from 'express';
import Ocorrencia from '../models/Ocorrencia';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

/**
 * @route POST /api/v1/ocorrencias
 * @desc Cria uma nova ocorrência para o usuário logado.
 * @access Private
 */
export const createOcorrencia = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
        return next(new AppError('Usuário não autenticado.', 401));
    }

    try {
        const novaOcorrencia = new Ocorrencia({
            ...req.body,
            usuarioId,
            dataHoraOcorrencia: req.body.dataHoraOcorrencia || new Date(),
        });
        
        await novaOcorrencia.save();
        res.status(201).json(novaOcorrencia);

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return next(new AppError(error.message, 400));
        }
        next(error);
    }
};

/**
 * @route GET /api/v1/ocorrencias
 * @desc Obtém todas as ocorrências com suporte a paginação e filtros.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 * @query {string} bioindicadorId - Filtra por ID do bioindicador.
 */
export const getOcorrencias = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const bioindicadorId = req.query.bioindicadorId as string;

    const filter: mongoose.FilterQuery<any> = {};
    if (bioindicadorId) {
        filter.bioindicadorId = bioindicadorId;
    }

    try {
        const ocorrencias = await Ocorrencia.find(filter)
            .populate('bioindicadorId', 'nomePopular nomeCientifico') // Retorna os dados do bioindicador
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOcorrencias = await Ocorrencia.countDocuments(filter);

        res.status(200).json({
            data: ocorrencias,
            page,
            limit,
            totalOcorrencias,
            totalPages: Math.ceil(totalOcorrencias / limit),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/v1/ocorrencias/minhas
 * @desc Obtém todas as ocorrências do usuário logado.
 * @access Private
 */
export const getMinhasOcorrencias = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
        return next(new AppError('Usuário não autenticado.', 401));
    }

    try {
        const minhasOcorrencias = await Ocorrencia.find({ usuarioId })
            .populate('bioindicadorId', 'nomePopular nomeCientifico')
            .sort({ createdAt: -1 });

        res.status(200).json(minhasOcorrencias);
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/v1/relatorio
 * @desc Gera um relatório estatístico de ocorrências para o usuário logado.
 * @access Private
 */
export const getRelatorio = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
        return next(new AppError('Usuário não autenticado.', 401));
    }

    try {
        const relatorio = await Ocorrencia.aggregate([
            { $match: { usuarioId: new mongoose.Types.ObjectId(usuarioId) } }, // Filtra por usuário logado
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
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/v1/mapa-calor
 * @desc Retorna dados para um mapa de calor.
 * @access Public
 */
export const getMapaCalor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const heatmapData = await Ocorrencia.aggregate([
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
    } catch (error) {
        next(error);
    }
};