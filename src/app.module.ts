import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { InboxController } from './inbox/inbox.controller';
import { NotificationsService } from './notifications/notifications.service';
import { InboxService } from './inbox/inbox.service';
import { ExcelService } from './excel/excel.service';
import { ExcelController } from './excel/excel.controller';

@Module({
  imports: [],
  controllers: [AppController, NotificationsController, InboxController, ExcelController],
  providers: [NotificationsService, InboxService, ExcelService],
})
export class AppModule {}
