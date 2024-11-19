import { Injectable, BadRequestException } from '@nestjs/common';
import { firestore } from '../firebase';

@Injectable()
export class SubscriptionService {

    private previousData : Record<string, any> = {};

    async checkCollctionChanges(collectionName: string): Promise<string[]> {
        if (!collectionName || collectionName.trim() === '') {
            throw new BadRequestException('Collection name is required');
        }
        if (!firestore){
            throw new Error('Firestore has not been init');
        }

        const collectionRef=firestore.collection(collectionName);
        const snapshot = await collectionRef.get();

        const currentData: Record<string, any> = {};
        const changes: string[] = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            currentData[doc.id] = data;

            if (!this.previousData[doc.id] || JSON.stringify(this.previousData[doc.id]) !== JSON.stringify(data)){
                changes.push(`Document ${doc.id} was added or modifoed`);
            }
        });

        for (const id of Object.keys(this.previousData)) {
            if (!currentData[id]) {
                changes.push(`Document ${id} was removed`);
            }
        }

        this.previousData = currentData;

        return changes;

    }

}
