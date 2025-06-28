import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter'; // Create this filter

const expressApp = express();

// Custom HTTP Exception Filter
class HttpExceptionFilter {
  catch(exception: any, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;
    response.status(status).json({
      success: false,
      message: exception.message || 'Internal server error',
    });
  }
}

export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn'],
  });

  // Enable CORS with specific origin
  app.enableCors({
    origin: 'https://phoenix-trading-frx.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Add global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Add global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // MongoDB connection with fallback
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }

  await app.init();
  await app.getHttpAdapter().getInstance().handle(req, res);
};
