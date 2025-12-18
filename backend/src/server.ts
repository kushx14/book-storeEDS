import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

connectDB();
app.get('/', (req, res) => {
  res.send('SERVER IS ALIVE');
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});