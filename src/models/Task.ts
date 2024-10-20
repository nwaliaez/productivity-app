// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  // Add more fields as needed
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
