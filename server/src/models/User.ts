import mongoose, { Schema, Document } from 'mongoose';

interface AllowedUser {
  formId: mongoose.Types.ObjectId;
  allowedUsers: {
    email: string;
    token: string;
    used: boolean;
  }[];
}

export interface IUser extends Document {
  email: string;
  name: string;
  formsCreated: mongoose.Types.ObjectId[]; // reference to Form
  accessMap: AllowedUser[];
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  formsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
  accessMap: [
    {
      formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
      allowedUsers: [
        {
          email: { type: String, required: true },
          token: { type: String, required: true },
          used: { type: Boolean, default: false }
        }
      ]
    }
  ]
});

export default mongoose.model<IUser>('User', userSchema);
