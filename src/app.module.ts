import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Example: Skip authentication for register route
    consumer.apply((req, res, next) => {
      if (req.path === '/api/auth/register' && req.method === 'POST') return next();
      // Apply your guard here for other routes
    }).forRoutes('*');
  }
}
