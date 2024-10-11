import { Body, Controller, Post, Get } from '@nestjs/common';
import { FirebaseService } from './firebase';

@Controller()
export class AppController {
  constructor(private firebaseService: FirebaseService) {}

  @Post('send')
  async sendNotification(
    @Body('token') token: string,
  ){
    try {
      await this.firebaseService.sendNotification(token);
      return 'Notification sent successfully!';
    } catch (error) {
      return `Failed to send notification: ${error.message}`;
    }
  }
  @Get()
  gethello(): string{
    return 'hello'
  }
  
}
