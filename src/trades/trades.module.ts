import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './trade.entity';
import { ContactController } from '../trades/contact.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trade', schema: TradeSchema }]),
    AuthModule,
  ],
  controllers: [TradesController, ContactController],
  providers: [TradesService],
})
export class TradesModule {}
