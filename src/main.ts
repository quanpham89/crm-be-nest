import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe({
    // Tự động loại bỏ những thông tin thừa (không có trong database) khi truyền từ fe sang
    whitelist : true,
    // Nếu trường thông tin không có database thì sẽ gửi thông báo không tồn tại trong db
    forbidNonWhitelisted: true
  }))
  app.setGlobalPrefix("api/v1",{exclude: ['']})
  await app.listen(port);
}
bootstrap();
 