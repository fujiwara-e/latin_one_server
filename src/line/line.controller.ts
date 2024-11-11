import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LineService } from './line.service';
import { Message } from '@line/bot-sdk';

@Controller('line')
export class LineController {
    constructor(private readonly lineService: LineService)  {} 
    @Post('sendline')
    async sendNotification(@Body('text') text: string){
        if (!text) {
            throw new HttpException('Message text is required', HttpStatus.BAD_REQUEST);
        }

        const message: Message = {
            type : 'text',
            text,
        };

        try {
            await this.lineService.sendNotification(message);
            return { message : 'Message sent successfully'};
        } catch (error) {
            console.error('Error sending message:', error);
            throw new HttpException('Failed to send message', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}


