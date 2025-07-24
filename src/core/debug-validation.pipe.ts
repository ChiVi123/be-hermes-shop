import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { globalValidationErrorFactory } from '~/utils/validation-error';

export class DebugValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableDebugMessages: true,
      validationError: {
        target: false,
        value: true,
      },
      exceptionFactory: globalValidationErrorFactory,
    });
  }

  async transform(value: unknown, metadata: ArgumentMetadata) {
    const transformedValue = (await super.transform(value, metadata)) as typeof value;
    return transformedValue;
  }
}
