import { Injectable } from '@nestjs/common';
import { admin, firestore } from '../firebase';
import { LineService } from '../line/line.service'
import { NotificationsService } from '../notifications/notifications.service'
import { Message } from '@line/bot-sdk';

@Injectable()
export class PollingService {
    constructor(private readonly lineservice: LineService, private readonly notificationsService: NotificationsService) {
        this.startListening();
    }


    private startListening() {
        // コレクションの監視
        const collectionRef = admin.firestore().collection('Orders');

        collectionRef.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const docData = change.doc.data();
                    const id = change.doc.id;
                    const token = docData.token;

                    const itemsDetails = docData.items
                        .map((item: { quantity: number; name: string }) => {
                            return `商品名: ${item.name}, 数量: ${item.quantity}`;
                        })
                        .join('\n');

                    const message = {
                        notification: {
                            title: '注文完了通知',
                            body: 'ご注文が確定しました．',
                        },
                        data: {
                            testData: '通知に含めたいデータなど',
                        },
                        token: token,
                    };
                    this.notificationsService.SendNotification(message);

                    const linemessage: Message = {
                        type: 'text',
                        text: `ドキュメントが追加されました:\nID: ${id}\n名前: ${docData.name}\n住所: ${docData.address}\nステータス: ${docData.status}\n日時: ${docData.date.toDate()}\nアイテム:\n${itemsDetails}`

                    }

                    this.lineservice.sendNotification(linemessage);

                }
                if (change.type === 'modified') {
                    const message: Message = {
                        type: 'text',
                        text: "ドキュメントが変更されました"
                    }
                    //this.lineservice.sendNotification(message);
                }
                if (change.type === 'removed') {
                    const message: Message = {
                        type: 'text',
                        text: "ドキュメントが消去されました"
                    }
                    //this.lineservice.sendNotification(message);
                }
            });
        });
    }

    async getLatestOrders(): Promise<any[]> {
        const collectionRef = admin.firestore().collection('Orders');
        const snapshot = await collectionRef
            .orderBy('date', 'desc')
            .limit(5)
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                date: (data.date.toDate()),
                status: data.status,
                mail_address: data.mail_address,
                items: data.items,

            };
        });
    }
    private convertToJST(date: Date): string {
        const jstOffset = 9 * 60;
        const jstDate = new Date(date.getTime() + jstOffset * 60 * 1000);

        const year = jstDate.getFullYear();
        const month = String(jstDate.getMonth() + 1).padStart(2, '0');
        const day = String(jstDate.getDate()).padStart(2, '0');
        const hours = String(jstDate.getHours()).padStart(2, '0');
        const minutes = String(jstDate.getMinutes()).padStart(2, '0');
        const seconds = String(jstDate.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
