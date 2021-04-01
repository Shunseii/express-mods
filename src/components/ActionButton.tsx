import React from "react";

import Button, { ButtonType } from "./Button/Button";

interface ActionButtonProps {
  label: string;
  className?: string;
  spinnerClassName?: string;
  type?: ButtonType;
  isLoading?: boolean;
  onClick?: () => void;
}

export const PrimaryActionButton: React.FC<ActionButtonProps> = ({
  label,
  className,
  spinnerClassName,
  type = "button",
  isLoading = false,
  onClick,
}) => {
  return (
    <Button
      label={label}
      className={className}
      theme="primary"
      variant="action"
      ActionButtonProps={{ type, isLoading, spinnerClassName, onClick }}
    />
  );
};

export const SecondaryActionButton: React.FC<ActionButtonProps> = ({
  label,
  className,
  spinnerClassName,
  type = "button",
  isLoading = false,
  onClick,
}) => {
  return (
    <Button
      label={label}
      className={className}
      theme="secondary"
      variant="action"
      ActionButtonProps={{ type, isLoading, spinnerClassName, onClick }}
    />
  );
};
