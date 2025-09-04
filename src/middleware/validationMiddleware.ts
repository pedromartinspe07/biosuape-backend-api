// src/middleware/validationMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../utils/AppError'; // Classe de erro personalizada

/**
 * Função para executar todas as validações de um array em um request.
 * @param validations Array de validações.
 * @returns Um array de RequestHandlers que podem ser usados como middleware.
 */
const runValidations = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    // Formata os erros para um formato mais limpo e amigável
    const formattedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
    }));
    
    return next(new AppError('Dados inválidos. Verifique os campos fornecidos.', 400));
  };
};

// ==================================
// REGRAS DE VALIDAÇÃO
// ==================================

/**
 * Regras de validação para o registro de um novo usuário.
 */
const registerRules = [
  body('nome')
    .notEmpty().withMessage('O nome é obrigatório.')
    .isString().withMessage('O nome deve ser uma string.')
    .trim()
    .isLength({ min: 3 }).withMessage('O nome deve ter no mínimo 3 caracteres.'),
  
  body('email')
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Por favor, insira um e-mail válido.'),
  
  body('password')
    .notEmpty().withMessage('A senha é obrigatória.')
    .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.'),
];

/**
 * Regras de validação para o login de um usuário.
 */
const loginRules = [
  body('email')
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Por favor, insira um e-mail válido.'),
  
  body('password')
    .notEmpty().withMessage('A senha é obrigatória.'),
];

/**
 * Regras de validação para a criação de uma nova ocorrência.
 */
const ocorrenciaRules = [
  body('bioindicadorId')
    .notEmpty().withMessage('O ID do bioindicador é obrigatório.')
    .isMongoId().withMessage('O ID do bioindicador é inválido.'),
  
  body('latitude')
    .notEmpty().withMessage('A latitude é obrigatória.')
    .isFloat({ min: -90, max: 90 }).withMessage('A latitude deve ser um número entre -90 e 90.'),
  
  body('longitude')
    .notEmpty().withMessage('A longitude é obrigatória.')
    .isFloat({ min: -180, max: 180 }).withMessage('A longitude deve ser um número entre -180 e 180.'),
  
  body('dataHoraOcorrencia')
    .optional()
    .isISO8601().withMessage('O campo dataHoraOcorrencia deve ser uma data válida no formato ISO 8601.'),
  
  body('ph')
    .optional()
    .isFloat({ min: 0, max: 14 }).withMessage('O pH deve ser um número entre 0 e 14.'),
  
  body('temperaturaAgua')
    .optional()
    .isFloat().withMessage('A temperatura da água deve ser um número válido.'),
  
  body('observacoes')
    .optional()
    .isString().withMessage('As observações devem ser uma string.')
    .isLength({ max: 250 }).withMessage('As observações não podem ter mais de 250 caracteres.'),
  
  body('imagemUrl')
    .optional()
    .isURL().withMessage('A URL da imagem não é válida.'),
];

// ==================================
// EXPORTAÇÃO DOS MIDDLEWARES
// ==================================

export const validateRegister = runValidations(registerRules);
export const validateLogin = runValidations(loginRules);
export const validateOcorrencia = runValidations(ocorrenciaRules);