import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { setUpSwagger } from '../swagger/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ErrorService } from 'src/services/error.service';

export function useInitial(app: INestApplication) {
  setUpSwagger(app);
  const errorService = app.get(ErrorService);
  app.useGlobalFilters(new HttpExceptionFilter(errorService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return errorService.handleError(
          new ValidationPipe().createExceptionFactory()(errors) as Error,
        );
      },
    }),
  );
}
