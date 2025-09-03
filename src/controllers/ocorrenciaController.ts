import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Ocorrencia from '../models/Ocorrencia';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

/**
 * Cria uma nova ocorrência com base nos dados fornecidos na requisição.
 * Agora utiliza o ID do usuário do token de autenticação.
 */
export const createOcorrencia = async (req: AuthenticatedRequest, res: Response) => {
  // A validação de entrada agora é feita pelo validationMiddleware.
  const { bioindicadorId, latitude, longitude, observacoes, ph, temperaturaAgua, imagemUrl } = req.body;
  const user = req.user as JwtPayload;
  const usuarioId = user.id;

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
    res.status(201).json(novaOcorrencia);
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar a ocorrência.' });
  }
};

/**
 * Obtém todas as ocorrências com suporte opcional a paginação e filtros.
 * @param {Request} req - A requisição. Pode conter parâmetros de query 'page', 'limit' e 'bioindicadorId'.
 * @param {Response} res - A resposta.
 */
export const getOcorrencias = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const bioindicadorId = req.query.bioindicadorId as string;

  const query: any = {};
  if (bioindicadorId) {
    query.bioindicadorId = bioindicadorId;
  }

  try {
    const ocorrencias = await Ocorrencia.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalOcorrencias = await Ocorrencia.countDocuments(query);
    const totalPages = Math.ceil(totalOcorrencias / limit);

    res.status(200).json({
      data: ocorrencias,
      page,
      limit,
      totalPages,
      totalOcorrencias,
    });
  } catch (error) {
    console.error('Erro ao buscar ocorrências:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar ocorrências.' });
  }
};

/**
 * Gera um relatório estatístico de ocorrências.
 * Atualmente retorna um esqueleto de dados agrupados por bioindicador.
 */
export const getRelatorio = async (req: Request, res: Response) => {
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
    res.status(200).json(relatorio);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao gerar relatório.' });
  }
};

/**
 * Retorna dados para um mapa de calor, agrupando ocorrências em uma grade de coordenadas.
 * A lógica é simplificada para fins de demonstração.
 */
export const getMapaCalor = async (req: Request, res: Response) => {
  try {
    // Exemplo de agregação para agrupar ocorrências por localização (simplificado)
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
    res.status(200).json(heatmapData);
  } catch (error) {
    console.error('Erro ao gerar dados para mapa de calor:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao gerar dados para mapa de calor.' });
  }
};
