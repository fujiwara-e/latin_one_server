import { Injectable } from '@nestjs/common';
import {admin, firestore} from '../firebase';
import {LineService} from '../line/line.service'
import { Message } from '@line/bot-sdk';

@Injectable()
export class PollingService {
    constructor(private readonly lineservice: LineService){
        console.log(firestore);
        this.startListening();
    }


    private startListening() {
        // コレクションの監視
        const collectionRef = admin.firestore().collection('test');

        collectionRef.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const message: Message ={
                        type: 'text',
                        text: "ドキュメントが追加されました" 
                    }
                    this.lineservice.sendNotification(message);

                }
                if (change.type === 'modified') {
                    const message: Message ={
                        type: 'text',
                        text: "ドキュメントが変更されました" 
                    }
                    this.lineservice.sendNotification(message);
                }
                if (change.type === 'removed') {
                    const message: Message ={
                        type: 'text',
                        text: "ドキュメントが消去されました" 
                    }
                    this.lineservice.sendNotification(message);
                }
            });
        });
    }
}
