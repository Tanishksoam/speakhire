import mongoose, { Schema, Document } from 'mongoose';

interface Field {
  label: string;
  type: string;
  options?: string[];
  required: boolean;
}

interface Response {
  [key: string]: string | string[];
}

export interface IForm extends Document {
  title: string;
  fields: Field[];
  responses: Response[];
  createdBy: mongoose.Types.ObjectId;
  isTemplate: boolean;
}

const formSchema: Schema<IForm> = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  responses: [{ type: mongoose.Schema.Types.Mixed, default: {} }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isTemplate: { type: Boolean, default: false }
});

export default mongoose.model<IForm>('Form', formSchema);
