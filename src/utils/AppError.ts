// src/utils/AppError.ts

/**
 * Classe de erro personalizada para a API.
 * Permite criar erros com mensagens e códigos de status HTTP específicos.
 * Isso facilita o tratamento de erros em um middleware centralizado.
 */
export class AppError extends Error {
    statusCode: number;
    status: 'fail' | 'error';
    isOperational: boolean;
  
    /**
     * Construtor da classe AppError.
     * @param message A mensagem de erro.
     * @param statusCode O código de status HTTP associado ao erro (ex: 404, 401).
     */
    constructor(message: string, statusCode: number) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Indica que este é um erro que podemos prever e tratar.
  
      // Captura o stack trace, excluindo a chamada do construtor
      Error.captureStackTrace(this, this.constructor);
    }
  }