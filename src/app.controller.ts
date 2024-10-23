import { Body, Controller, Post, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  gethello(): string{
    return 'hello'
  }

}
