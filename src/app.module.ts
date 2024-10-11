import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { InboxController } from './inbox/inbox.controller';
import { NotificationsService } from './notifications/notifications.service';
import { InboxService } from './inbox/inbox.service';

@Module({
  imports: [],
  controllers: [AppController, NotificationsController, InboxController],
  providers: [NotificationsService, InboxService],
})
export class AppModule {}
