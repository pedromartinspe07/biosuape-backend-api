"use strict";
// src/models/Bioindicador.ts
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
// Definição do esquema do Mongoose para a coleção de bioindicadores
const BioindicadorSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
});
// Cria e exporta o modelo do Mongoose
const Bioindicador = mongoose_1.default.model('Bioindicador', BioindicadorSchema);
exports.default = Bioindicador;
