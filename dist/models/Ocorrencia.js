"use strict";
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
// Definição do esquema do Mongoose para a coleção de ocorrências.
const OcorrenciaSchema = new mongoose_1.Schema({
    usuarioId: {
        type: String,
        required: [true, 'O ID do usuário é obrigatório.'],
        trim: true,
    },
    bioindicadorId: {
        type: String,
        required: [true, 'O ID do bioindicador é obrigatório.'],
    },
    latitude: {
        type: Number,
        required: [true, 'A latitude é obrigatória.'],
        min: [-90, 'Latitude deve ser maior ou igual a -90.'],
        max: [90, 'Latitude deve ser menor ou igual a 90.'],
    },
    longitude: {
        type: Number,
        required: [true, 'A longitude é obrigatória.'],
        min: [-180, 'Longitude deve ser maior ou igual a -180.'],
        max: [180, 'Longitude deve ser menor ou igual a 180.'],
    },
    dataHoraOcorrencia: {
        type: Date,
        default: Date.now,
    },
    ph: {
        type: Number,
        min: [0, 'pH deve ser maior ou igual a 0.'],
        max: [14, 'pH deve ser menor ou igual a 14.'],
    },
    temperaturaAgua: {
        type: Number,
        // Sugestão de melhoria: adicione uma validação de valor mínimo.
        min: [0, 'A temperatura da água não pode ser um valor negativo.'],
    },
    observacoes: {
        type: String,
        trim: true,
        maxlength: [250, 'As observações não podem ter mais de 250 caracteres.'],
    },
    imagemUrl: {
        type: String,
        trim: true,
    },
}, {
    // Adiciona automaticamente os campos `createdAt` e `updatedAt`.
    timestamps: true,
});
exports.default = mongoose_1.default.model('Ocorrencia', OcorrenciaSchema);
