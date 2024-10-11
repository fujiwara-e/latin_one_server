import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class NotificationsService {
  constructor() {
    this.initializeFirebase(); // constructor内でFirebaseの初期化を呼び出す
  }

  // メソッドは function キーワードを使わない
  async initializeFirebase() {
    try {
      const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
      const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf-8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  async sendNotification(registrationToken: string): Promise<void> {
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

