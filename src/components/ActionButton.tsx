import React from "react";

import Button, { ButtonType } from "./Button/Button";

interface ActionButtonProps {
  label: string;
  className?: string;
  type?: ButtonType;
  isLoading?: boolean;
  LoadingIcon?: React.FC;
  onClick?: () => void;
}

export const PrimaryActionButton: React.FC<ActionButtonProps> = ({
  label,
  className,
  type = "button",
  isLoading = false,
  LoadingIcon,
  onClick,
}) => {
  return (
    <Button
      label={label}
      className={className}
      theme="primary"
      variant="action"
      ActionButtonProps={{ type, isLoading, LoadingIcon, onClick }}
    />
  );
};

export const SecondaryActionButton: React.FC<ActionButtonProps> = ({
  label,
  className,
  type = "button",
  isLoading = false,
  LoadingIcon,
  onClick,
}) => {
  return (
    <Button
      label={label}
      className={className}
      theme="secondary"
      variant="action"
      ActionButtonProps={{ type, isLoading, LoadingIcon, onClick }}
    />
  );
};
