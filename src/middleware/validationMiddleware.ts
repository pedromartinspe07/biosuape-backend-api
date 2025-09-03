import { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import type { ValidationChain } from 'express-validator';

/**
 * Middleware para lidar com o resultado das validações do express-validator.
 * Se houver erros, envia uma resposta 400. Caso contrário, passa para o próximo middleware.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * Validação para o corpo da requisição ao criar uma nova ocorrência.
 * Garante que todos os campos obrigatórios estão presentes e no formato correto.
 */
export const validateOcorrencia: (ValidationChain | RequestHandler)[] = [
    body('usuarioId')
        .isString()
        .notEmpty()
        .withMessage('O ID do usuário é obrigatório.'),
    body('bioindicadorId')
        .isString()
        .notEmpty()
        .withMessage('O ID do bioindicador é obrigatório.'),
    body('latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('A latitude deve ser um número entre -90 e 90.'),
    body('longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('A longitude deve ser um número entre -180 e 180.'),
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
        .isString()
        .isLength({ max: 250 })
        .withMessage('As observações não podem ter mais de 250 caracteres.'),
    body('imagemUrl')
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
export const validateUser: (ValidationChain | RequestHandler)[] = [
    body('email')
        .isEmail()
        .withMessage('E-mail inválido.'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter no mínimo 6 caracteres.'),
    
    // Middleware final para tratar os erros de validação
    handleValidationErrors,
];
