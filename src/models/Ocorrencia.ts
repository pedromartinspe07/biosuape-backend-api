import mongoose, { Schema, Document } from 'mongoose';

// Interface que define a estrutura de um documento de ocorrência.
export interface IOcorrencia extends Document {
  usuarioId: string;
  bioindicadorId: string;
  latitude: number;
  longitude: number;
  dataHoraOcorrencia: Date;
  ph?: number;
  temperaturaAgua?: number;
  observacoes?: string;
  imagemUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definição do esquema do Mongoose para a coleção de ocorrências.
const OcorrenciaSchema: Schema = new Schema(
  {
    usuarioId: {
      type: String,
      required: [true, 'O ID do usuário é obrigatório.'],
      trim: true,
    },
    bioindicadorId: {
      type: String,
      required: [true, 'O ID do bioindicador é obrigatório.'],
    },
    latitude: {
      type: Number,
      required: [true, 'A latitude é obrigatória.'],
      min: [-90, 'Latitude deve ser maior ou igual a -90.'],
      max: [90, 'Latitude deve ser menor ou igual a 90.'],
    },
    longitude: {
      type: Number,
      required: [true, 'A longitude é obrigatória.'],
      min: [-180, 'Longitude deve ser maior ou igual a -180.'],
      max: [180, 'Longitude deve ser menor ou igual a 180.'],
    },
    dataHoraOcorrencia: {
      type: Date,
      default: Date.now,
    },
    ph: {
      type: Number,
      min: [0, 'pH deve ser maior ou igual a 0.'],
      max: [14, 'pH deve ser menor ou igual a 14.'],
    },
    temperaturaAgua: {
      type: Number,
      // Sugestão de melhoria: adicione uma validação de valor mínimo.
      min: [0, 'A temperatura da água não pode ser um valor negativo.'],
    },
    observacoes: {
      type: String,
      trim: true,
      maxlength: [250, 'As observações não podem ter mais de 250 caracteres.'],
    },
    imagemUrl: {
      type: String,
      trim: true,
    },
  },
  {
    // Adiciona automaticamente os campos `createdAt` e `updatedAt`.
    timestamps: true,
  }
);

export default mongoose.model<IOcorrencia>('Ocorrencia', OcorrenciaSchema);
