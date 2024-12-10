import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeFirebase } from './firebase';

async function bootstrap() {
    await initializeFirebase();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
