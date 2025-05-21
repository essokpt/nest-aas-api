import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Nest Rest-Api')
    .setDescription('Rest API Description')
    .setVersion('1.0')
    .addTag('Api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

 // app.useStaticAssets(join(__dirname, '../../', 'web_files'));

 
  app.enableCors();
  await app.listen(3005);
}
bootstrap();
