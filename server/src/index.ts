import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import formRoutes from './routes/form';
import userRoutes from './routes/user';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/forms', formRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});
