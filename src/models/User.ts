import mongoose, { Schema, Document, Model, Query } from 'mongoose';
import { isEmail } from 'validator';
import mongooseBcrypt from 'mongoose-bcrypt';

// Adicionando o método `comparePassword` à interface do Mongoose Document
// A interface IUser já tem a definição de `comparePassword`.
interface IUser extends Document {
  nome: string;
  email: string;
  password?: string; // O plugin espera esse nome. Use '?' pois o select: false o torna opcional
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// A tipagem para o método estático `findByEmail`
interface UserModel extends Model<IUser> {
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
      // Adicionando um índice para otimizar as buscas
      index: true,
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      bcrypt: true, // Necessário para o plugin
      select: false, // Não retorna a senha por padrão
    },
  },
  {
    timestamps: true,
  }
);

// Plugin para hash de senha e comparePassword
UserSchema.plugin(mongooseBcrypt);

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