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
        console.log(`Middleware hit for ${req.method} ${req.url}`);
        if (req.path === '/api/auth/register' && req.method === 'POST') {
          console.log('Allowing /api/auth/register POST');
          return next();
        }
        console.log('Blocking or passing to next middleware/guard');
        return next(); // Allow other routes to proceed to guards or controllers
      })
      .forRoutes('*');
  }
}
