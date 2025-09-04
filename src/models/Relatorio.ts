// src/models/Relatorio.ts

import mongoose, { Schema, Document } from 'mongoose';

// Interface para a estrutura de dados de um dataset individual dentro de 'dados'
interface IDataset {
  data: number[];
  label?: string;
}

// Interface para a estrutura de dados aninhada 'dados'
interface IRelatorioDados {
  labels: string[];
  datasets: IDataset[];
}

// Interface principal que define a estrutura de dados para o documento de Relatorio
export interface IRelatorio extends Document {
  titulo: string;
  descricao: string;
  dados: IRelatorioDados;
  createdAt?: Date;
  updatedAt?: Date;
}

// Esquema do Mongoose para a estrutura de um dataset
const DatasetSchema: Schema = new Schema({
  data: {
    type: [Number],
    required: true,
  },
  label: {
    type: String,
  },
}, { _id: false }); // Não gera _id para subdocumentos

// Esquema do Mongoose para a estrutura aninhada 'dados'
const RelatorioDadosSchema: Schema = new Schema({
  labels: {
    type: [String],
    required: true,
  },
  datasets: {
    type: [DatasetSchema],
    required: true,
  },
}, { _id: false }); // Não gera _id para subdocumentos

// Definição do esquema principal para a coleção de relatórios
const RelatorioSchema: Schema = new Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título do relatório é obrigatório.'],
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, 'A descrição do relatório é obrigatória.'],
    },
    dados: {
      type: RelatorioDadosSchema,
      required: true,
    },
  },
  {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
  }
);

// Cria e exporta o modelo do Mongoose
const Relatorio = mongoose.model<IRelatorio>('Relatorio', RelatorioSchema);

export default Relatorio;