"use strict";
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
// src/config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
// Pega a URL de conexão do MongoDB das variáveis de ambiente
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:QesydXajnqGpnSRgiddlcERUsHAtTJfY@shuttle.proxy.rlwy.net:37405';
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI);
        console.log('Conexão com o MongoDB estabelecida com sucesso!');
    }
    catch (error) {
        console.error('Falha na conexão com o MongoDB:', error);
        process.exit(1); // Sai do processo com falha
    }
});
exports.default = connectDB;
