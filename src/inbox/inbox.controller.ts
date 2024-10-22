import { Controller, Post, Body } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService,
  private readonly notificationsService: NotificationsService,
  ) {}
  @Post('addfirebase')
  async ReceivePostAndRegisterToFirestore(
    @Body('topic') topic: string,
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('image') image: string
  ) {
    try {
      await this.inboxService.RegisterFirebase(topic, title, body, image);
      await this.notificationsService.SendNotificationForAll(topic, title, body);

      return 'Added to firebase successfully!';
    } catch (error) {
      return `Failed to add to firebase: ${error.message}`;
    }
  }
}
