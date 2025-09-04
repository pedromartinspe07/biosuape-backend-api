// src/models/User.ts

import mongoose, { Schema, Document, Model, Query } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';

// =======================
// INTERFACES E TIPAGEM
// =======================

/**
 * Interface que representa um documento do usuário no MongoDB.
 */
export interface IUser extends Document {
  nome: string;
  email: string;
  role: 'user' | 'admin';
  password?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  
  // Métodos de instância
  comparePassword(candidatePassword: string): Promise<boolean>;
  changePasswordAfter(JWTIssuedAt: number): boolean;
  createPasswordResetToken(): string;
}

/**
 * Interface para o modelo de usuário, incluindo métodos estáticos.
 */
export interface UserModel extends Model<IUser> {
  findByEmail(email: string, selectPassword?: boolean): Query<IUser | null, IUser>;
}

// =======================
// SCHEMA DO USUÁRIO
// =======================

const UserSchema: Schema<IUser> = new Schema(
  {
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
      validate: [isEmail, 'Por favor, insira um e-mail válido.'],
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
  },
  {
    timestamps: true,
  }
);

// =======================
// MIDDLEWARES DO SCHEMA
// =======================

/**
 * Middleware para fazer o hash da senha antes de salvar.
 * Ação: Antes de salvar o documento.
 */
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  // O sal (salt) é gerado de forma síncrona com o valor 10.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  
  // Remove o campo passwordChangedAt para que o token JWT seja revalidado
  this.passwordChangedAt = new Date(Date.now() - 1000); // 1 segundo no passado
  
  next();
});

// =======================
// MÉTODOS DE INSTÂNCIA
// =======================

/**
 * Compara a senha fornecida pelo usuário com a senha hasheada no banco de dados.
 * @param candidatePassword A senha a ser comparada.
 * @returns Retorna `true` se as senhas coincidirem, `false` caso contrário.
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
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
UserSchema.statics.findByEmail = function (
  email: string,
  selectPassword: boolean = false
): Query<IUser | null, IUser> {
  const query = this.findOne({ email });
  if (selectPassword) {
    query.select('+password');
  }
  return query;
};

// =======================
// CRIAÇÃO DO MODELO
// =======================

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;