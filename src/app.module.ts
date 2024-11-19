import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { InboxController } from './inbox/inbox.controller';
import { NotificationsService } from './notifications/notifications.service';
import { InboxService } from './inbox/inbox.service';
import { ExcelService } from './excel/excel.service';
import { ExcelController } from './excel/excel.controller';
import { LineController } from './line/line.controller';
import { LineService } from './line/line.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  imports: [],
  controllers: [AppController, NotificationsController, InboxController, ExcelController, LineController, SubscriptionController],
  providers: [NotificationsService, InboxService, ExcelService, LineService, SubscriptionService],
})
export class AppModule {}
