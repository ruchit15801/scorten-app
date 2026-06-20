import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: [
      configService.get('APP_URL'),
      'http://localhost:3000',
      'http://localhost:8081',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
    credentials: true,
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Scorten API')
      .setDescription('AI-Powered Hiring & Professional Growth Platform For Educators')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Authentication & Authorization')
      .addTag('Teachers', 'Teacher management')
      .addTag('Schools', 'School management')
      .addTag('Jobs', 'Job posting & discovery')
      .addTag('Applications', 'Job applications & tracking')
      .addTag('Interviews', 'AI & School interviews')
      .addTag('Gigs', 'Gig marketplace')
      .addTag('Courses', 'Learning & courses')
      .addTag('Payments', 'Payment processing')
      .addTag('Messages', 'Real-time messaging')
      .addTag('Notifications', 'Push notifications')
      .addTag('Admin', 'Admin dashboard')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════╗
  ║          SCORTEN API SERVER               ║
  ║   AI-Powered Teacher Hiring Platform      ║
  ╠═══════════════════════════════════════════╣
  ║  🚀  Server: http://localhost:${port}        ║
  ║  📚  Docs:   http://localhost:${port}/api/docs ║
  ║  🌍  ENV:    ${configService.get('NODE_ENV')}               ║
  ╚═══════════════════════════════════════════╝
  `);
}

bootstrap();
