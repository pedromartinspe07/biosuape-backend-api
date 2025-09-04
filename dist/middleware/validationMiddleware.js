"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateOcorrencia = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware para lidar com o resultado das validações.
 * Se houver erros, envia uma resposta 400.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
/**
 * Validações específicas para a criação de uma nova Ocorrência.
 */
const validateOcorrenciaRules = [
    // Usando .isMongoId() é mais preciso do que .isString() para IDs do MongoDB
    (0, express_validator_1.body)('bioindicadorId')
        .isMongoId()
        .withMessage('O ID do bioindicador é obrigatório e deve ser um ID válido.'),
    (0, express_validator_1.body)('latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('A latitude deve ser um número entre -90 e 90.'),
    (0, express_validator_1.body)('longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('A longitude deve ser um número entre -180 e 180.'),
    (0, express_validator_1.body)('dataHora')
        .optional()
        .isISO8601()
        .withMessage('O campo dataHora deve ser uma data válida no formato ISO 8601.'),
    (0, express_validator_1.body)('ph')
        .optional()
        .isFloat({ min: 0, max: 14 })
        .withMessage('O pH deve ser um número entre 0 e 14.'),
    (0, express_validator_1.body)('temperaturaAgua')
        .optional()
        .isFloat()
        .withMessage('A temperatura da água deve ser um número válido.'),
    (0, express_validator_1.body)('observacoes')
        .optional()
        .isLength({ max: 250 })
        .withMessage('As observações não podem ter mais de 250 caracteres.'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL()
        .withMessage('A URL da imagem não é válida.'),
];
/**
 * Validações para a criação de um novo usuário.
 */
const validateUserRules = [
    (0, express_validator_1.body)('nome')
        .isString()
        .notEmpty()
        .withMessage('O nome do usuário é obrigatório.'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('E-mail inválido.'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter no mínimo 6 caracteres.'),
];
// Combine as regras de validação com o middleware de tratamento de erros
exports.validateOcorrencia = [
    ...validateOcorrenciaRules,
    handleValidationErrors
];
exports.validateUser = [
    ...validateUserRules,
    handleValidationErrors
];
