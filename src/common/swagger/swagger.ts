import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setUpSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('swagger example')
    .setDescription('The swagger API description')
    .setVersion('1.0')
    .addTag('swagger')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
