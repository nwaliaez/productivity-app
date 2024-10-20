import mongoose, { Schema, Document, model } from 'mongoose';

interface IForm extends Document {
  userId: string;
  formData: Record<string, string>; // Dynamic key-value pairs
  createdAt: Date;
}

const formSchema: Schema<IForm> = new Schema({
  userId: { type: String, required: true }, // Reference to the user from Postgres
  formData: { type: Map, of: String }, // Dynamic fields as key-value pairs
  createdAt: { type: Date, default: Date.now },
});

const Form = mongoose.models.Form || model<IForm>('Form', formSchema);

export default Form;
