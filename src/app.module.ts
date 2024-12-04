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
import { PollingService } from './polling/polling.service';
import { PollingController } from './polling/polling.controller';

@Module({
  imports: [],
  controllers: [AppController, NotificationsController, InboxController, ExcelController, LineController, SubscriptionController, PollingController],
  providers: [NotificationsService, InboxService, ExcelService, LineService, SubscriptionService, PollingService],
})
export class AppModule {}
