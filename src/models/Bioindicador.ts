// src/models/Bioindicador.ts

import mongoose, { Schema, Document } from 'mongoose';

// =======================
// INTERFACES E TIPAGEM
// =======================

/**
 * Define as categorias de bioindicadores para garantir a consistência dos dados.
 * Você pode expandir esta lista conforme a necessidade.
 */
export enum CategoriaBioindicador {
  ALGA = 'Alga',
  MOLUSCO = 'Molusco',
  CRUSTACEO = 'Crustáceo',
  PEIXE = 'Peixe',
  OUTRO = 'Outro',
}

/**
 * Interface que define a estrutura de dados para um documento de bioindicador.
 * Inclui o campo `categoria` para melhor organização.
 */
export interface IBioindicador extends Document {
  nomePopular: string;
  nomeCientifico: string;
  descricao: string;
  funcaoBioindicadora: string;
  imageUrl: string;
  categoria: CategoriaBioindicador;
  createdAt?: Date;
  updatedAt?: Date;
}

// =======================
// ESQUEMA DO MONGOOSE
// =======================

// Definição do esquema do Mongoose para a coleção de bioindicadores
const BioindicadorSchema: Schema<IBioindicador> = new Schema(
  {
    nomePopular: {
      type: String,
      required: [true, 'O nome popular é obrigatório.'],
      trim: true,
      index: true, // Adiciona um índice para buscas mais rápidas
    },
    nomeCientifico: {
      type: String,
      required: [true, 'O nome científico é obrigatório.'],
      unique: true, // Garante a unicidade
      trim: true,
      index: true, // Adiciona um índice para buscas mais rápidas
    },
    descricao: {
      type: String,
      required: [true, 'A descrição é obrigatória.'],
      trim: true,
      minlength: [20, 'A descrição deve ter no mínimo 20 caracteres.'],
    },
    funcaoBioindicadora: {
      type: String,
      required: [true, 'A função bioindicadora é obrigatória.'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'A URL da imagem é obrigatória.'],
      trim: true,
    },
    categoria: {
      type: String,
      enum: Object.values(CategoriaBioindicador), // Garante que a categoria seja um dos valores do enum
      required: [true, 'A categoria do bioindicador é obrigatória.'],
      default: CategoriaBioindicador.OUTRO,
    },
  },
  {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
  }
);

// Cria e exporta o modelo do Mongoose
const Bioindicador = mongoose.model<IBioindicador>('Bioindicador', BioindicadorSchema);

export default Bioindicador;