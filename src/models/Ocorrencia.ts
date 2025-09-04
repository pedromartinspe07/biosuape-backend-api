// src/models/Ocorrencia.ts

import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// =======================
// INTERFACES E TIPAGEM
// =======================

/**
 * Interface que define a estrutura de um documento de ocorrência.
 * Ela herda de `Document` do Mongoose para incluir os campos padrão como `_id`.
 */
export interface IOcorrencia extends Document {
  usuarioId: ObjectId;
  bioindicadorId: ObjectId;
  latitude: number;
  longitude: number;
  dataHoraOcorrencia: Date;
  ph?: number;
  temperaturaAgua?: number;
  observacoes?: string;
  imagemUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// =======================
// ESQUEMA DO MONGOOSE
// =======================

// Definição do esquema do Mongoose para a coleção de ocorrências.
const OcorrenciaSchema: Schema<IOcorrencia> = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Referência ao modelo de usuário
      required: [true, 'A ocorrência deve estar associada a um usuário.'],
      index: true, // Adiciona um índice para consultas mais rápidas
    },
    bioindicadorId: {
      type: Schema.Types.ObjectId,
      ref: 'Bioindicador', // Referência ao modelo de bioindicador (assumindo que ele exista)
      required: [true, 'O ID do bioindicador é obrigatório.'],
      index: true,
    },
    latitude: {
      type: Number,
      required: [true, 'A latitude é obrigatória.'],
      min: [-90, 'Latitude inválida. O valor deve estar entre -90 e 90.'],
      max: [90, 'Latitude inválida. O valor deve estar entre -90 e 90.'],
    },
    longitude: {
      type: Number,
      required: [true, 'A longitude é obrigatória.'],
      min: [-180, 'Longitude inválida. O valor deve estar entre -180 e 180.'],
      max: [180, 'Longitude inválida. O valor deve estar entre -180 e 180.'],
    },
    dataHoraOcorrencia: {
      type: Date,
      default: Date.now,
      required: [true, 'A data e hora da ocorrência são obrigatórias.'],
      index: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: 'A data da ocorrência não pode ser no futuro.',
      },
    },
    ph: {
      type: Number,
      min: [0, 'O pH deve ser um valor entre 0 e 14.'],
      max: [14, 'O pH deve ser um valor entre 0 e 14.'],
      nullable: true, // Permite valores nulos, mas não undefined
    },
    temperaturaAgua: {
      type: Number,
      min: [-2, 'A temperatura da água não pode ser negativa.'],
      nullable: true,
    },
    observacoes: {
      type: String,
      trim: true,
      maxlength: [250, 'As observações não podem ter mais de 250 caracteres.'],
    },
    imagemUrl: {
      type: String,
      trim: true,
      validate: {
        // Exemplo de validação de URL simples
        validator: (value: string) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value),
        message: 'A URL da imagem não é válida.',
      },
      nullable: true,
    },
  },
  {
    timestamps: true, // Adiciona automaticamente os campos `createdAt` e `updatedAt`.
  }
);

// Cria e exporta o modelo do Mongoose
const Ocorrencia = mongoose.model<IOcorrencia>('Ocorrencia', OcorrenciaSchema);

export default Ocorrencia;