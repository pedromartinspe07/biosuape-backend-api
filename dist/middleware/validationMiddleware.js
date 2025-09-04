"use strict";
// src/middleware/validationMiddleware.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOcorrencia = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
const AppError_1 = require("../utils/AppError"); // Classe de erro personalizada
/**
 * Função para executar todas as validações de um array em um request.
 * @param validations Array de validações.
 * @returns Um array de RequestHandlers que podem ser usados como middleware.
 */
const runValidations = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        // Formata os erros para um formato mais limpo e amigável
        const formattedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : 'unknown',
            message: err.msg,
        }));
        return next(new AppError_1.AppError('Dados inválidos. Verifique os campos fornecidos.', 400));
    });
};
// ==================================
// REGRAS DE VALIDAÇÃO
// ==================================
/**
 * Regras de validação para o registro de um novo usuário.
 */
const registerRules = [
    (0, express_validator_1.body)('nome')
        .notEmpty().withMessage('O nome é obrigatório.')
        .isString().withMessage('O nome deve ser uma string.')
        .trim()
        .isLength({ min: 3 }).withMessage('O nome deve ter no mínimo 3 caracteres.'),
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage('O e-mail é obrigatório.')
        .isEmail().withMessage('Por favor, insira um e-mail válido.'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('A senha é obrigatória.')
        .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.'),
];
/**
 * Regras de validação para o login de um usuário.
 */
const loginRules = [
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage('O e-mail é obrigatório.')
        .isEmail().withMessage('Por favor, insira um e-mail válido.'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('A senha é obrigatória.'),
];
/**
 * Regras de validação para a criação de uma nova ocorrência.
 */
const ocorrenciaRules = [
    (0, express_validator_1.body)('bioindicadorId')
        .notEmpty().withMessage('O ID do bioindicador é obrigatório.')
        .isMongoId().withMessage('O ID do bioindicador é inválido.'),
    (0, express_validator_1.body)('latitude')
        .notEmpty().withMessage('A latitude é obrigatória.')
        .isFloat({ min: -90, max: 90 }).withMessage('A latitude deve ser um número entre -90 e 90.'),
    (0, express_validator_1.body)('longitude')
        .notEmpty().withMessage('A longitude é obrigatória.')
        .isFloat({ min: -180, max: 180 }).withMessage('A longitude deve ser um número entre -180 e 180.'),
    (0, express_validator_1.body)('dataHoraOcorrencia')
        .optional()
        .isISO8601().withMessage('O campo dataHoraOcorrencia deve ser uma data válida no formato ISO 8601.'),
    (0, express_validator_1.body)('ph')
        .optional()
        .isFloat({ min: 0, max: 14 }).withMessage('O pH deve ser um número entre 0 e 14.'),
    (0, express_validator_1.body)('temperaturaAgua')
        .optional()
        .isFloat().withMessage('A temperatura da água deve ser um número válido.'),
    (0, express_validator_1.body)('observacoes')
        .optional()
        .isString().withMessage('As observações devem ser uma string.')
        .isLength({ max: 250 }).withMessage('As observações não podem ter mais de 250 caracteres.'),
    (0, express_validator_1.body)('imagemUrl')
        .optional()
        .isURL().withMessage('A URL da imagem não é válida.'),
];
// ==================================
// EXPORTAÇÃO DOS MIDDLEWARES
// ==================================
exports.validateRegister = runValidations(registerRules);
exports.validateLogin = runValidations(loginRules);
exports.validateOcorrencia = runValidations(ocorrenciaRules);
