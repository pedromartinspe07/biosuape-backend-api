import { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import type { ValidationChain } from 'express-validator';

/**
 * Middleware para lidar com o resultado das validações.
 * Se houver erros, envia uma resposta 400.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * Validações específicas para a criação de uma nova Ocorrência.
 */
const validateOcorrenciaRules: ValidationChain[] = [
    // Usando .isMongoId() é mais preciso do que .isString() para IDs do MongoDB
    body('bioindicadorId')
        .isMongoId()
        .withMessage('O ID do bioindicador é obrigatório e deve ser um ID válido.'),
    body('latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('A latitude deve ser um número entre -90 e 90.'),
    body('longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('A longitude deve ser um número entre -180 e 180.'),
    body('dataHora')
        .optional()
        .isISO8601()
        .withMessage('O campo dataHora deve ser uma data válida no formato ISO 8601.'),
    body('ph')
        .optional()
        .isFloat({ min: 0, max: 14 })
        .withMessage('O pH deve ser um número entre 0 e 14.'),
    body('temperaturaAgua')
        .optional()
        .isFloat()
        .withMessage('A temperatura da água deve ser um número válido.'),
    body('observacoes')
        .optional()
        .isLength({ max: 250 })
        .withMessage('As observações não podem ter mais de 250 caracteres.'),
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('A URL da imagem não é válida.'),
];

/**
 * Validações para a criação de um novo usuário.
 */
const validateUserRules: ValidationChain[] = [
    body('nome')
        .isString()
        .notEmpty()
        .withMessage('O nome do usuário é obrigatório.'),
    body('email')
        .isEmail()
        .withMessage('E-mail inválido.'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter no mínimo 6 caracteres.'),
];

// Combine as regras de validação com o middleware de tratamento de erros
export const validateOcorrencia = [
    ...validateOcorrenciaRules,
    handleValidationErrors
];

export const validateUser = [
    ...validateUserRules,
    handleValidationErrors
];