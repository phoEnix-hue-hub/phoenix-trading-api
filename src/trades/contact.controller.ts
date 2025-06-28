import { Controller, Get } from '@nestjs/common';

@Controller('contact')
export class ContactController {
  @Get()
  getContact() {
    return { message: 'Contact endpoint is working' };
  }
}
