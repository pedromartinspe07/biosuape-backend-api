"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateOcorrencia = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware para lidar com o resultado das validações do express-validator.
 * Se houver erros, envia uma resposta 400. Caso contrário, passa para o próximo middleware.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
/**
 * Validação para o corpo da requisição ao criar uma nova ocorrência.
 * Garante que todos os campos obrigatórios estão presentes e no formato correto.
 */
exports.validateOcorrencia = [
    (0, express_validator_1.body)('usuarioId')
        .isString()
        .notEmpty()
        .withMessage('O ID do usuário é obrigatório.'),
    (0, express_validator_1.body)('bioindicadorId')
        .isString()
        .notEmpty()
        .withMessage('O ID do bioindicador é obrigatório.'),
    (0, express_validator_1.body)('latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('A latitude deve ser um número entre -90 e 90.'),
    (0, express_validator_1.body)('longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('A longitude deve ser um número entre -180 e 180.'),
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
        .isString()
        .isLength({ max: 250 })
        .withMessage('As observações não podem ter mais de 250 caracteres.'),
    (0, express_validator_1.body)('imagemUrl')
        .optional()
        .isURL()
        .withMessage('A URL da imagem não é válida.'),
    // Middleware final para tratar os erros de validação
    handleValidationErrors,
];
/**
 * Exemplo de validação para a criação de um novo usuário.
 * Pode ser adaptada para sua rota de autenticação.
 */
exports.validateUser = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('E-mail inválido.'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter no mínimo 6 caracteres.'),
    // Middleware final para tratar os erros de validação
    handleValidationErrors,
];
