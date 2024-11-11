import { Injectable } from '@nestjs/common';
import { Message } from '@line/bot-sdk';
import { notify as lineNotify } from '../line';

@Injectable()
export class LineService {
    async sendNotification(message: Message) {
        return lineNotify(message);
    }
}
