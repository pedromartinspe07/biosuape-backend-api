// src/models/User.ts
import mongoose, { Schema, Document, Model, Query } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';

// Interface do usuário
export interface IUser extends Document {
  nome: string;
  email: string;
  password?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface do modelo com método estático
export interface UserModel extends Model<IUser> {
  findByEmail(email: string, selectPassword?: boolean): Query<IUser | null, IUser>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório.'],
      trim: true,
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
      select: false, // Não retorna a senha por padrão
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para fazer o hash da senha antes de salvar
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

// Método de instância para comparar a senha
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

// Método estático para buscar por e-mail
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

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;