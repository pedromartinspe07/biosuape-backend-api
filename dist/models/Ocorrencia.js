"use strict";
// src/models/Ocorrencia.ts
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// =======================
// ESQUEMA DO MONGOOSE
// =======================
// Definição do esquema do Mongoose para a coleção de ocorrências.
const OcorrenciaSchema = new mongoose_1.Schema({
    usuarioId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Referência ao modelo de usuário
        required: [true, 'A ocorrência deve estar associada a um usuário.'],
        index: true, // Adiciona um índice para consultas mais rápidas
    },
    bioindicadorId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator: (value) => value <= new Date(),
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
            validator: (value) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value),
            message: 'A URL da imagem não é válida.',
        },
        nullable: true,
    },
}, {
    timestamps: true, // Adiciona automaticamente os campos `createdAt` e `updatedAt`.
});
// Cria e exporta o modelo do Mongoose
const Ocorrencia = mongoose_1.default.model('Ocorrencia', OcorrenciaSchema);
exports.default = Ocorrencia;
