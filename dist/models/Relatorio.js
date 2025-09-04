"use strict";
// src/models/Relatorio.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Esquema do Mongoose para a estrutura de um dataset
const DatasetSchema = new mongoose_1.Schema({
    data: {
        type: [Number],
        required: true,
    },
    label: {
        type: String,
    },
}, { _id: false }); // Não gera _id para subdocumentos
// Esquema do Mongoose para a estrutura aninhada 'dados'
const RelatorioDadosSchema = new mongoose_1.Schema({
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
const RelatorioSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
});
// Cria e exporta o modelo do Mongoose
const Relatorio = mongoose_1.default.model('Relatorio', RelatorioSchema);
exports.default = Relatorio;
