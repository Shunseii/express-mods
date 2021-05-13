import { GraphQLError } from "graphql";

export enum ErrorMessage {
  VALIDATION_ERROR = "Argument Validation Error",
  AUTHORIZATION_ERROR = "Access denied!",
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

const isValidationError = (error: GraphQLError): boolean => {
  return error.message.includes(ErrorMessage.VALIDATION_ERROR);
};

const isAuthorizationError = (error: GraphQLError): boolean => {
  return error.message.includes(ErrorMessage.AUTHORIZATION_ERROR);
};

interface ErrorMap {
  validation: {
    [key: string]: string;
  };
  errors: string[];
}

const mapValidationErrors = (error: GraphQLError): ErrorMap["validation"] => {
  const {
    validationErrors,
  } = (error.extensions as GraphQLErrorExtension).exception;
  let validationFields = {};

  validationErrors.forEach((err) => {
    const { property, constraints } = err;

    for (let key in constraints) {
      validationFields[property] = constraints[key];
      break;
    }
  });

  return validationFields;
};

export const mapAPIErrors = (errors: GraphQLError[] = []): ErrorMap => {
  let errorsMap: ErrorMap = {
    validation: {},
    errors: [],
  };

  for (let i = 0; i < errors.length; ++i) {
    const error = errors[i];

    if (isValidationError(error)) {
      errorsMap.validation = mapValidationErrors(error);
    } else if (isAuthorizationError(error)) {
      errorsMap.errors.push(error.message);
    }

    return errorsMap;
  }
};
