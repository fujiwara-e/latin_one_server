import { Body, Controller, Post, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {

  constructor(private readonly NotificationsService: NotificationsService) {}

  @Post('send')
  async ReceivePostAndSendNotification(
    @Body('token') token: string,
  ){
    try {
      await this.NotificationsService.SendNotification(token);
      return 'Notification sent successfully!';
    } catch (error) {
      return `Failed to send notification: ${error.message}`;
    }
  }

  @Post('sendAll')
  async ReceivePostAndSendNotificationForAll(
    @Body('topic') topic: string,
    @Body('title') title: string,
    @Body('body') body: string,
  ){
    try {
      await this.NotificationsService.SendNotificationForAll(topic, title, body);
      return 'Notification sent successfully!';
    } catch (error) {
      return `Failed to send notification: ${error.message}`;
    }
  }
}