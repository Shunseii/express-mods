import { GraphQLError } from "graphql";

export enum ErrorMessage {
  VALIDATION_ERROR = "Argument Validation Error",
}

interface ValidationError {
  target?: object;
  property: string;
  value?: any;
  constraints?: {
    [type: string]: string;
  };
  children?: ValidationError[];
}

type GraphQLErrorExtension =
  | {
      [key: string]: any;
      code: string;
      exception: {
        stacktrace: string[];
        validationErrors: ValidationError[];
      };
    }
  | undefined;

export const mapValidationErrors = (
  errors: GraphQLError[]
): { [key: string]: string } => {
  for (let i = 0; i < errors.length; ++i) {
    const error = errors[i];

    if (error.message.includes(ErrorMessage.VALIDATION_ERROR)) {
      const {
        validationErrors,
      } = (error.extensions as GraphQLErrorExtension).exception;

      const fields: { [key: string]: string } = {};

      validationErrors.forEach((err) => {
        const { property, constraints } = err;

        for (let key in constraints) {
          fields[property] = constraints[key];
          break;
        }
      });

      return fields;
    }
  }
};
