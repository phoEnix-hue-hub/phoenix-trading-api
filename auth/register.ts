import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module'; // Adjusted from '../../src/app.module'
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter'; // Adjusted from '../../src/filters/http-exception.filter'

const expressApp = express();

let cachedApp: any = null;

export default async (req: any, res: any) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || '', {
    // Removed deprecated options; Mongoose 6+ handles this automatically
      });
      console.log('Connected to MongoDB');
    }
    if (!cachedApp) {
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
    }

    await cachedApp.getHttpAdapter().getInstance().handle(req, res);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
