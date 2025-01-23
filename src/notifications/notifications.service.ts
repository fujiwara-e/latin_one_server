import { Injectable } from '@nestjs/common';
import { admin } from '../firebase';

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

  async SendNotification(message): Promise<void> {

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}

