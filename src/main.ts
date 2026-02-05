import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BadRequestException, LogLevel, ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './common/filters/error.filter';
import config from '@config/app.config';
import helmet from 'helmet';
import { join } from 'path';
import { ValidationError } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/index-browser';

async function bootstrap() {

  const isProduction = process.env.NODE_ENV === 'production';
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn'] 
    : ['log', 'debug', 'error', 'verbose', 'warn'];

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [
        config().app.client.url || 'http://localhost:3000',
        'http://localhost:3000',
      ],
      credentials: true,
    },
    logger: logLevels
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
        },
      },
    }),
  );


  /**
   * 
   * Views Configuration
   */
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  (Decimal.prototype as any).toJSON = function () {
    return Number(this.toString());
  };

  // Jika pakai BigInt juga:
  (BigInt.prototype as any).toJSON = function () {
    return Number(this.toString());
  };

  /**
   * 
   * Configuration & registering class validator error pipes
   * Change config to custom error response validation
   */
  app.useGlobalPipes(new ValidationPipe({

    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,

    exceptionFactory: (errors) => {
      let cause: string[] = []

      function errorRecrusive(err: ValidationError, parentKey = '') {
        const key = parentKey ? `${parentKey}.${err.property}` : err.property;

        if (!cause.find((e: string) => e.startsWith(key))) {

          if (err.constraints) {
            cause.push(`${key}: ${Object.values(err.constraints).join(', ')}`);
          } else if (err.children?.length) {
            err.children.forEach(child => errorRecrusive(child, key));
          }

        }
      }

      errors.forEach(error => errorRecrusive(error));

      // Return every error at every field
      return new BadRequestException("Error validate", {
        cause
      });
    }
  }));

  // Global error filter
  app.useGlobalFilters(new ErrorFilter());


  await app.listen(config().app.port ?? 3000);
}
bootstrap();
