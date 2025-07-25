import { UnprocessableEntityException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

export const globalValidationErrorFactory = (errors: ValidationError[]) => {
  const formattedErrors = errors.map(({ property, constraints }) => ({
    property,
    constraints: Object.values(constraints || {}),
  }));

  return new UnprocessableEntityException(formattedErrors);
};

type ClassValidator = <T>(cls: ClassConstructor<T>) => (plain: Record<string, unknown>) => T;
export const classValidator: ClassValidator = (cls) => (plain) => {
  const validatedConfig = plainToInstance(
    cls,
    plain,
    { enableImplicitConversion: true }, // Important for type conversion
  );

  const errors = validateSync(validatedConfig as object, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw globalValidationErrorFactory(errors);
  }
  return validatedConfig;
};
