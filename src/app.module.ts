import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { Request, Response, NextFunction } from 'express';

@Module({
  imports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        if (req.path === '/api/auth/register' && req.method === 'POST') return next();
        // Apply your guard here for other routes if needed
      })
      .forRoutes('*');
  }
}
