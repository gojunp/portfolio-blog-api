import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Portfolio/Blog API')
    .setDescription(
      'Content management system and data storage of blog posts and portfolio projects'
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearerAuth' // Use a unique name for this security definition
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  document.security = [{ bearerAuth: [] }];
  SwaggerModule.setup('docs', app, document);
}
