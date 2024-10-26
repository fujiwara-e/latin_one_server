import { Injectable } from '@nestjs/common';
import {admin} from '../firebase';

@Injectable()
export class NotificationsService {
  constructor() {
  }

  async SendNotificationForAll(topic: string, title: string, body: string): Promise<void> {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      topic: topic,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async SendNotification(registrationToken: string): Promise<void> {
    const message = {
      notification: {
        title: 'テスト通知',
        body: 'テストのプッシュ通知です',
      },
      data: {
        testData: '通知に含めたいデータなど',
      },
      token: registrationToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}

