import { Client, ClientConfig, Message } from '@line/bot-sdk';


console.log('CHANNEL_ACCESS_TOKEN:', process.env.CHANNEL_ACCESS_TOKEN);
console.log('CHANNEL_SECRET:', process.env.CHANNEL_SECRET);
console.log('LINE_USER_ID:', process.env.LINE_USER_ID);

const config: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || '',
};
const client = new Client(config);
const userId = process.env.LINE_USER_ID || '';

export const notify = async (message: Message) => {
  try {
    await client.pushMessage(userId, message);
    console.log('Message sent');
  } catch (error) {
    console.error('Error sending message', error);
  }
};
