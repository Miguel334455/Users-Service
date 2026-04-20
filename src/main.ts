import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  // ─── Global Prefix ───────────────────────────────────────────────────
  app.setGlobalPrefix('api');
 
  // ─── Global Validation Pipe ──────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true,          // Auto-transform payloads to DTO instances
    }),
  );
 
  // ─── CORS ────────────────────────────────────────────────────────────
  app.enableCors({
    origin: '*', // In production, restrict to API Gateway URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
 
  // ─── Swagger / OpenAPI Docs ──────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Users Microservice')
    .setDescription('API for managing users in the eCommerce platform')
    .setVersion('1.0')
    .addTag('users')
    .build();
 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
 
  // ─── Start Server ────────────────────────────────────────────────────
  const port = process.env.PORT || 3001;
  await app.listen(port);
 
  console.log(`🚀 Users Service running on: http://localhost:${port}`);
  console.log(`📖 Swagger Docs at: http://localhost:${port}/api/docs`);
}
 
bootstrap();