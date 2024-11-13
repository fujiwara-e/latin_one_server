import { Client, ClientConfig, Message } from '@line/bot-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const config: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ,
  channelSecret: process.env.CHANNEL_SECRET ,
};
const client = new Client(config);
const userId = process.env.LINE_USER_ID ;

export const notify = async (message: Message) => {
  try {
    await client.pushMessage(userId, message);
    console.log('Message sent');
  } catch (error) {
    console.error('Error sending message', error);
  }
};
