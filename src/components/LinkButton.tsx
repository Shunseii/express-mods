import React from "react";

import Button from "./Button/Button";

interface LinkButtonProps {
  label: string;
  className?: string;
  href: string;
}

export const PrimaryLinkButton: React.FC<LinkButtonProps> = ({
  label,
  className,
  href,
}) => {
  return (
    <Button
      label={label}
      className={className}
      variant="link"
      theme="primary"
      LinkButtonProps={{ href }}
    />
  );
};

export const SecondaryLinkButton: React.FC<LinkButtonProps> = ({
  label,
  className,
  href,
}) => {
  return (
    <Button
      label={label}
      className={className}
      variant="link"
      theme="secondary"
      LinkButtonProps={{ href }}
    />
  );
};
