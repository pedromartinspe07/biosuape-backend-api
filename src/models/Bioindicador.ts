// src/models/Bioindicador.ts

import mongoose, { Schema, Document } from 'mongoose';

// Interface que define a estrutura de dados para um documento de bioindicador
export interface IBioindicador extends Document {
  nomePopular: string;
  nomeCientifico: string;
  descricao: string;
  funcaoBioindicadora: string;
  imageUrl: string;
  createdAt?: Date; // Adicionado pelo timestamps: true
  updatedAt?: Date; // Adicionado pelo timestamps: true
}

// Definição do esquema do Mongoose para a coleção de bioindicadores
const BioindicadorSchema: Schema = new Schema(
  {
    nomePopular: {
      type: String,
      required: [true, 'O nome popular é obrigatório.'],
      trim: true,
    },
    nomeCientifico: {
      type: String,
      required: [true, 'O nome científico é obrigatório.'],
      unique: true, // Garante que não haverá bioindicadores duplicados pelo nome científico
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, 'A descrição é obrigatória.'],
    },
    funcaoBioindicadora: {
      type: String,
      required: [true, 'A função bioindicadora é obrigatória.'],
    },
    imageUrl: {
      type: String,
      required: [true, 'A URL da imagem é obrigatória.'],
    },
  },
  {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
  }
);

// Cria e exporta o modelo do Mongoose
const Bioindicador = mongoose.model<IBioindicador>('Bioindicador', BioindicadorSchema);

export default Bioindicador;