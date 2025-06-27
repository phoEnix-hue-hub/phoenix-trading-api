import { Controller, Get, Post, Body } from '@nestjs/common';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  async findAll(): Promise<Trade[]> {
    const trades = await this.tradesService.findAll();
    console.log('Trades fetched:', trades);
    return trades;
  }

  @Post()
  async create(@Body() createTradeDto: Trade): Promise<Trade> {
    return this.tradesService.create(createTradeDto);
  }
}

@Controller('contact')
export class ContactController {
  @Post()
  async submit(@Body() contact: { name: string; email: string; message: string }) {
    console.log('Contact submitted:', contact);
    // Add email service or logging here in the future
    return { success: true, message: 'Contact form submitted successfully' };
  }
}
