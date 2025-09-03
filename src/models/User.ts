import mongoose, { Schema, Document, Model } from 'mongoose';
import { isEmail } from 'validator';

// Interface do usuário
export interface IUser extends Document {
  nome: string;
  email: string;
  password: string; // O plugin espera esse nome
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface do modelo com método estático
export interface UserModel extends Model<IUser> {
  findByEmail(email: string, selectPassword?: boolean): Promise<IUser | null>;
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
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      bcrypt: true, // Necessário para o plugin
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Plugin para hash de senha e comparePassword
UserSchema.plugin(require('mongoose-bcrypt'));

// Método estático para buscar por e-mail
UserSchema.statics.findByEmail = async function (
  email: string,
  selectPassword: boolean = false
): Promise<IUser | null> {
  let query = this.findOne({ email });
  if (selectPassword) {
    query = query.select('+password');
  }
  return await query;
};

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;