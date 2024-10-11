import { Controller, Post, Body } from '@nestjs/common';
import { InboxService } from './inbox.service';
@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}
  @Post('addfirebase')
  async sendNotification(
    @Body('date') date: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('image') image: string
  ) {
    try {
      await this.inboxService.registfirebase(date, title, description, image);
      return 'Added to firebase successfully!';
    } catch (error) {
      return `Failed to add to firebase: ${error.message}`;
    }
  }
}
