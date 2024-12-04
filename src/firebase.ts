import * as admin from 'firebase-admin';
import * as path from 'path';
import { readFile } from 'fs/promises'

let firestore;

export async function initializeFirebase() {
  try {
    const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
    const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf-8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    firestore = admin.firestore();

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

initializeFirebase();
export {admin, firestore};
