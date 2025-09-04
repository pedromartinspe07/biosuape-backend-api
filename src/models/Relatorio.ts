// src/models/Relatorio.ts

import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb'; // Tipo do MongoDB para IDs

// =======================
// INTERFACES E TIPAGEM
// =======================

/**
 * Interface para a estrutura de dados de um dataset individual dentro de 'dados'.
 * Inclui campos essenciais para a representação gráfica.
 */
interface IDataset {
  data: number[];
  label: string;
  backgroundColor?: string; // Cor para o gráfico
}

/**
 * Interface para a estrutura de dados aninhada 'dados'.
 * Representa os dados que serão usados para gerar gráficos ou tabelas.
 */
interface IRelatorioDados {
  labels: string[];
  datasets: IDataset[];
}

/**
 * Interface principal que define a estrutura de dados para o documento de Relatorio.
 * Inclui uma referência ao usuário que criou o relatório.
 */
export interface IRelatorio extends Document {
  titulo: string;
  descricao: string;
  usuarioId: ObjectId; // Referência ao ID do usuário
  dados: IRelatorioDados;
  createdAt?: Date;
  updatedAt?: Date;
}

// =======================
// ESQUEMAS DO MONGOOSE
// =======================

// Esquema para a estrutura de um dataset
const DatasetSchema: Schema = new Schema({
  data: {
    type: [Number],
    required: [true, 'Os dados do dataset são obrigatórios.'],
  },
  label: {
    type: String,
    required: [true, 'O rótulo do dataset é obrigatório.'],
  },
  backgroundColor: {
    type: String,
  },
}, { _id: false }); // Não gera _id para subdocumentos

// Esquema para a estrutura aninhada 'dados'
const RelatorioDadosSchema: Schema = new Schema({
  labels: {
    type: [String],
    required: [true, 'Os rótulos do gráfico são obrigatórios.'],
  },
  datasets: {
    type: [DatasetSchema],
    required: [true, 'O conjunto de dados é obrigatório.'],
  },
}, { _id: false }); // Não gera _id para subdocumentos

// Definição do esquema principal para a coleção de relatórios
const RelatorioSchema: Schema<IRelatorio> = new Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título do relatório é obrigatório.'],
      trim: true,
      minlength: [3, 'O título deve ter no mínimo 3 caracteres.'],
    },
    descricao: {
      type: String,
      required: [true, 'A descrição do relatório é obrigatória.'],
      trim: true,
    },
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Referência à coleção 'User'
      required: [true, 'A referência ao usuário é obrigatória.'],
    },
    dados: {
      type: RelatorioDadosSchema,
      required: [true, 'Os dados do relatório são obrigatórios.'],
    },
  },
  {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
  }
);

// Cria e exporta o modelo do Mongoose
const Relatorio = mongoose.model<IRelatorio>('Relatorio', RelatorioSchema);

export default Relatorio;