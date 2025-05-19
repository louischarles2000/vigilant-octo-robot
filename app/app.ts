import express from 'express';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';
import router from './routes';

dotenv.config();

const app = express();

// Create a write stream (in append mode) for the logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

// Use morgan middleware with the write stream
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Enable CORS for all origins
app.use(cors({ origin: '*' }));

// Other middlewares
app.use(express.json());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register your routes
app.use(router);

pool.getConnection()
  .then((connection: any) => {
    console.log('Connected to the database');
    connection.release();
  })
  .catch((err: any) => {
    console.error('Error connecting to the database:', err);
  });
  

export default app;
