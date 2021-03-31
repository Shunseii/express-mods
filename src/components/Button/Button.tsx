import React from "react";
import Link from "next/link";

import LoadingSpinner from "../LoadingSpinner";

import styles from "./Button.module.scss";

export type ButtonType = "submit" | "reset" | "button";
export type ButtonVariant = "link" | "action";
export type ButtonTheme = "primary" | "secondary";

interface LinkButtonProps {
  href: string;
}

interface ActionButtonProps {
  type?: ButtonType;
  isLoading?: boolean;
  onClick?: () => void;
}

interface ButtonProps {
  label: string;
  variant: ButtonVariant;
  className?: string;
  theme?: ButtonTheme;
  LinkButtonProps?: LinkButtonProps;
  ActionButtonProps?: ActionButtonProps;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant,
  className,
  theme = "primary",
  LinkButtonProps,
  ActionButtonProps,
}) => {
  if (variant === "action") {
    const themeClassName =
      theme === "primary"
        ? styles.primaryActionButton
        : styles.secondaryActionButton;

    const { type = "button", isLoading = false, onClick } = ActionButtonProps;

    return (
      <button
        type={type}
        onClick={onClick}
        className={`${themeClassName} ${className}`}
      >
        {isLoading ? <LoadingSpinner /> : label}
      </button>
    );
  } else {
    const themeClassName =
      theme === "primary"
        ? styles.primaryLinkButton
        : styles.secondaryLinkButton;

    const { href } = LinkButtonProps;

    return (
      <Link href={href}>
        <span className={`${themeClassName} ${className}`}>{label}</span>
      </Link>
    );
  }
};

export default Button;
