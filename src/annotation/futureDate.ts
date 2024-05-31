import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';

export function FutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'futureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const currentDate = new Date();
          const inputDate = new Date(value);
          return inputDate.getTime() > currentDate.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date in the future`;
        },
      },
    });
  };
}
