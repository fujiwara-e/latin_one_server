import { Injectable } from '@nestjs/common';
import { admin } from '../firebase';
import { format } from 'date-fns';
@Injectable()
export class InboxService {
    constructor() {

    }

    async RegisterFirebase(topic: string,title: string, body: string, imagePath: string): Promise<void> {

        const counterRef = admin.firestore().collection('counters').doc('MessageCounter');
        const newDocId = await admin.firestore().runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);

            if (!counterDoc.exists) {
                transaction.set(counterRef, { count: 1 });
                return 1;
            } else if (topic === 'Announce') {
                const currentCount = counterDoc.data().count;
                const newCount = currentCount + 1;
                transaction.update(counterRef, { count: newCount });
                return newCount;
            }
        });

        try {
            if (topic === 'Product' || topic === 'Shop') {
                const counterRef = admin.firestore().collection('counters').doc('WhatsNewCounter');
                const newDocId = await admin.firestore().runTransaction(async (transaction) => {
                    const counterDoc = await transaction.get(counterRef);
                    if (!counterDoc.exists) {
                        transaction.set(counterRef, { count: 1 });
                        return 1;
                    } else {
                        const currentCount = counterDoc.data().count;
                        const newCount = currentCount + 1;
                        transaction.update(counterRef, { count: newCount });
                        return newCount;
                    }
                });

                const backRef = admin.firestore().collection('Inbox').doc('WhatsNew');
                const docSnapshot = await backRef.get();

               if (docSnapshot.exists) {
                  const existingData = docSnapshot.data();
                  const data = {
                    ...existingData,
                    [newDocId] :{
                      date: format(new Date(), 'yyyy-MM-dd'),
                      title: title,
                      body: body,
                      imagePath: imagePath
                    }
                  };
                  const docRef = await admin.firestore().collection('Inbox').doc('WhatsNew').set(data);
                  console.log('Successfully sent message:', docRef);
               }else{
                    const data = {
                        [newDocId] :{
                        date: format(new Date(), 'yyyy-MM-dd'),
                        title: title,
                        body: body,
                        imagePath: imagePath
                        }
                    };
                    const docRef = await admin.firestore().collection('Inbox').doc('WhatsNew').set(data);
                    console.log('Successfully sent message:', docRef);
               }
            }else{
                const backRef = admin.firestore().collection('Inbox').doc('WhatsNew');
                const docSnapshot = await backRef.get();
                if (docSnapshot.exists) {
                    const existingData = docSnapshot.data();
                    const data = {
                      ...existingData,
                      [newDocId] :{
                        date: format(new Date(), 'yyyy-MM-dd'),
                        title: title,
                        body: body,
                        imagePath: imagePath
                      }
                    };
                    const docRef = await admin.firestore().collection('Inbox').doc('Message').set(data);
                    console.log('Successfully sent message:', docRef);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }




}
