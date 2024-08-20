import mongoose from 'mongoose';
import { MONGODB_URI_ENV } from '../config/env';
import dotenv from 'dotenv';

dotenv.config();

if (!MONGODB_URI_ENV) {
  console.error('MONGODB_URI_ENV is not defined. Check your environment configuration.');
} else {
  mongoose
    .connect(MONGODB_URI_ENV, { dbName: 'packages'})
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}
