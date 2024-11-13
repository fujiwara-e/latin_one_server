import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { admin } from './firebase';
//import * as dotenv from 'dotenv';
//dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORSを有効にする
  app.enableCors({
    origin: 'http://localhost:3000', // クライアントのURLを指定
    methods: 'GET,POST', // 許可するHTTPメソッド
    credentials: true, // Cookieを使用する場合に必要
  });
  await app.listen(4000);
}
bootstrap();
