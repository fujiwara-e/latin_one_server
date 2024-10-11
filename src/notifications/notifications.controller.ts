import { Body, Controller, Post, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {

  constructor(private readonly NotificationsService: NotificationsService) {}

  @Post('send')
  async sendNotification(
    @Body('token') token: string,
  ){
    try {
      await this.NotificationsService.sendNotification(token);
      return 'Notification sent successfully!';
    } catch (error) {
      return `Failed to send notification: ${error.message}`;
    }
  }
}