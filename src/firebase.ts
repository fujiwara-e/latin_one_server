import * as admin from 'firebase-admin';
import * as path from 'path';
import { readFile } from 'fs/promises'

async function initializeFirebase() {
  try {
    // `await`を使用してサービスアカウントキーを読み込む
    const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
    const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf-8'));

    // Firebaseアプリを初期化
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

export class FirebaseService {
  async sendNotification(registrationToken: string): Promise<void> {
    const message = {
      notification: {
        title: 'テスト通知',
        body: 'テストのプッシュ通知です'
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

initializeFirebase();

