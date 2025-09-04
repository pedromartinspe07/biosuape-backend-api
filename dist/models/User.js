"use strict";
// src/models/User.ts
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = require("validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
// =======================
// SCHEMA DO USUÁRIO
// =======================
const UserSchema = new mongoose_1.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
        trim: true,
        minlength: [3, 'O nome deve ter no mínimo 3 caracteres.'],
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório.'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.isEmail, 'Por favor, insira um e-mail válido.'],
        index: true,
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        minlength: [8, 'A senha deve ter no mínimo 8 caracteres.'],
        select: false, // Não retorna a senha por padrão
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
});
// =======================
// MIDDLEWARES DO SCHEMA
// =======================
/**
 * Middleware para fazer o hash da senha antes de salvar.
 * Ação: Antes de salvar o documento.
 */
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        // O sal (salt) é gerado de forma síncrona com o valor 10.
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
        // Remove o campo passwordChangedAt para que o token JWT seja revalidado
        this.passwordChangedAt = new Date(Date.now() - 1000); // 1 segundo no passado
        next();
    });
});
// =======================
// MÉTODOS DE INSTÂNCIA
// =======================
/**
 * Compara a senha fornecida pelo usuário com a senha hasheada no banco de dados.
 * @param candidatePassword A senha a ser comparada.
 * @returns Retorna `true` se as senhas coincidirem, `false` caso contrário.
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.password) {
            return false;
        }
        return bcrypt_1.default.compare(candidatePassword, this.password);
    });
};
// =======================
// MÉTODOS ESTÁTICOS
// =======================
/**
 * Busca um usuário por e-mail.
 * @param email O e-mail do usuário a ser buscado.
 * @param selectPassword Se `true`, a senha também será retornada.
 * @returns A Query do Mongoose.
 */
UserSchema.statics.findByEmail = function (email, selectPassword = false) {
    const query = this.findOne({ email });
    if (selectPassword) {
        query.select('+password');
    }
    return query;
};
// =======================
// CRIAÇÃO DO MODELO
// =======================
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
