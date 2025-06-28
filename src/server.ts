import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

const expressApp = express();

export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn'],
  });

  // Enable CORS with specific origin
  app.enableCors({
    origin: 'https://phoenix-trading-frx.vercel.app', // Exact frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',       // Allowed methods
    allowedHeaders: 'Content-Type, Authorization',   // Allowed headers
    credentials: true,                              // Allow cookies/auth credentials if needed
  });

  // MongoDB connection
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  await app.init();
  await app.getHttpAdapter().getInstance().handle(req, res);
};
