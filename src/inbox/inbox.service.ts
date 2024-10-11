import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { readFile } from 'fs/promises';
@Injectable()
export class InboxService {
    constructor() {

    }

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

    async registfirebase(date: string, title: string, description: string, image: string): Promise<void> {
        const data = {
            date: date,
            title: title,
            description: description,
            image: image
        };

        try {
            const docRef = await admin.firestore().collection('servertest').doc('test').set(data);
            console.log('Successfully sent message:', docRef);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }




}
