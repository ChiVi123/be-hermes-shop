import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const globalValidationErrorFactory = (errors: ValidationError[]) => {
  const formattedErrors = errors.map(({ property, constraints }) => ({
    property,
    constraints: Object.values(constraints || {}),
  }));

  return new UnprocessableEntityException(formattedErrors);
};
