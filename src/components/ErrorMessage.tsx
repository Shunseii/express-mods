import React from "react";
import { RiErrorWarningFill as ErrorIcon } from "react-icons/ri";

interface ErrorMessageProps {
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, className }) => {
  return (
    <p className={`text-red-600 ${className}`}>
      <ErrorIcon className="inline mr-2" />
      <span className="text-sm font-light">{children}</span>
    </p>
  );
};

export default ErrorMessage;
