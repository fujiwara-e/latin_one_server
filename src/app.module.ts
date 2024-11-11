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

@Module({
  imports: [],
  controllers: [AppController, NotificationsController, InboxController, ExcelController, LineController],
  providers: [NotificationsService, InboxService, ExcelService, LineService],
})
export class AppModule {}
