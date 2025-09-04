// src/controllers/ocorrenciaController.ts
import { Request, Response } from 'express';
import Ocorrencia from '../models/Ocorrencia';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

/**
 * @route POST /api/v1/ocorrencias
 * @desc Cria uma nova ocorrência.
 * @access Private
 */
export const createOcorrencia = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  const { bioindicadorId, latitude, longitude, observacoes, ph, temperaturaAgua, imagemUrl } = req.body;
  const usuarioId = req.user.id;

  try {
    const novaOcorrencia = new Ocorrencia({
      usuarioId,
      bioindicadorId,
      latitude,
      longitude,
      observacoes,
      ph,
      temperaturaAgua,
      imagemUrl,
    });
    await novaOcorrencia.save();

    return res.status(201).json(novaOcorrencia);
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao criar a ocorrência.' });
  }
};

/**
 * @route GET /api/v1/ocorrencias
 * @desc Obtém todas as ocorrências com suporte opcional a paginação e filtros.
 * @access Public
 * @query {number} page - Número da página.
 * @query {number} limit - Número de itens por página.
 * @query {string} bioindicadorId - Filtra por ID do bioindicador.
 */
export const getOcorrencias = async (req: Request, res: Response): Promise<Response> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const bioindicadorId = req.query.bioindicadorId as string;

  const query: mongoose.FilterQuery<any> = {};
  if (bioindicadorId) {
    query.bioindicadorId = bioindicadorId;
  }

  try {
    const ocorrencias = await Ocorrencia.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalOcorrencias = await Ocorrencia.countDocuments(query);
    const totalPages = Math.ceil(totalOcorrencias / limit);

    return res.status(200).json({
      data: ocorrencias,
      page,
      limit,
      totalPages,
      totalOcorrencias,
    });
  } catch (error) {
    console.error('Erro ao buscar ocorrências:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao buscar ocorrências.' });
  }
};

/**
 * @route GET /api/v1/relatorio
 * @desc Gera um relatório estatístico de ocorrências.
 * @access Private
 */
export const getRelatorio = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const relatorio = await Ocorrencia.aggregate([
      {
        $group: {
          _id: '$bioindicadorId',
          count: { $sum: 1 },
          avgPh: { $avg: '$ph' },
          avgTemperaturaAgua: { $avg: '$temperaturaAgua' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    return res.status(200).json(relatorio);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao gerar relatório.' });
  }
};

/**
 * @route GET /api/v1/mapa-calor
 * @desc Retorna dados para um mapa de calor.
 * @access Public
 */
export const getMapaCalor = async (req: Request, res: Response): Promise<Response> => {
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
    ]);
    return res.status(200).json(heatmapData);
  } catch (error) {
    console.error('Erro ao gerar dados para mapa de calor:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao gerar dados para mapa de calor.' });
  }
};