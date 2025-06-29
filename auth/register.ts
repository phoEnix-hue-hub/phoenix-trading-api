import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';

const expressApp = express();

let cachedApp: any = null;

export default async (req: any, res: any) => {
  console.log('Request received:', req.url, req.method);
  try {
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI;
      if (!uri) throw new Error('MONGODB_URI is not set');
      console.log('Attempting MongoDB connection with URI:', uri);
      await mongoose.connect(uri, {});
      console.log('Connected to MongoDB');
    }

    if (!cachedApp) {
      console.log('Initializing NestJS app');
      const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
      app.enableCors({
        origin: 'https://phoenix-trading-b7y2dn094-phoenixs-projects-300fd110.vercel.app',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
      });
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      app.useGlobalFilters(new HttpExceptionFilter());
      await app.init();
      cachedApp = app;
      console.log('NestJS app initialized');
    }

    console.log('Handling request');
    await cachedApp.getHttpAdapter().getInstance().handle(req, res);
  } catch (err) {
    console.error('Server error details:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(err instanceof Error && err.name === 'UnauthorizedError' ? 401 : 500)
       .json({ success: false, message: errorMessage });
  }
};
