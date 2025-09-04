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
exports.CategoriaBioindicador = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// =======================
// INTERFACES E TIPAGEM
// =======================
/**
 * Define as categorias de bioindicadores para garantir a consistência dos dados.
 * Você pode expandir esta lista conforme a necessidade.
 */
var CategoriaBioindicador;
(function (CategoriaBioindicador) {
    CategoriaBioindicador["ALGA"] = "Alga";
    CategoriaBioindicador["MOLUSCO"] = "Molusco";
    CategoriaBioindicador["CRUSTACEO"] = "Crust\u00E1ceo";
    CategoriaBioindicador["PEIXE"] = "Peixe";
    CategoriaBioindicador["OUTRO"] = "Outro";
})(CategoriaBioindicador || (exports.CategoriaBioindicador = CategoriaBioindicador = {}));
// =======================
// ESQUEMA DO MONGOOSE
// =======================
// Definição do esquema do Mongoose para a coleção de bioindicadores
const BioindicadorSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
});
// Cria e exporta o modelo do Mongoose
const Bioindicador = mongoose_1.default.model('Bioindicador', BioindicadorSchema);
exports.default = Bioindicador;
