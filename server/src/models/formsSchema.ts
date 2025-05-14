import mongoose, { Schema, Document } from 'mongoose';

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

export interface Response{
  [key:string]:string|string[];
}

export interface Recipient{
  email:string;
  token:string;
  used:boolean;
}

export interface IForm extends Document {
  // userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  formFields: FormField[];
  recipients:Recipient[];//receipens with one time token to fill the form 
  createdBy?:mongoose.Types.ObjectId;
  responses:Response[];
  accesstoke:string;//main token for form owner to edit/acess
  isPublished: boolean;
  publishedUrl: string;

  customStyles?: Record<string, any>;
}

const FormSchema: Schema = new Schema({
  // userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  formFields: [{
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: [{ type: String }]
  }],
  // formfields: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  responses: [{
    id: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  }],
  accessToken: { type: String },
  recipients: [{
    email: { type: String },
    token: { type: String },
    used: { type: Boolean, default: false }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  isPublished: { type: Boolean, default: false },
  publishedUrl: { type: String, default: '' },
  // expiresAt: { type: Date },
  customStyles: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IForm>('Form', FormSchema);