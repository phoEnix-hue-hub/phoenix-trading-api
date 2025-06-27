import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from './trade.entity';

@Injectable()
export class TradesService {
  constructor(@InjectModel('Trade') private tradeModel: Model<TradeDocument>) {}

  async findAll(): Promise<Trade[]> {
    return this.tradeModel.find().exec();
  }

  async create(trade: Trade): Promise<Trade> {
    const createdTrade = new this.tradeModel(trade);
    return createdTrade.save();
  }
}
