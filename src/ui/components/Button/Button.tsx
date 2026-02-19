import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  // TODO: Add conditional classNames - done: added variant-based classNames and loading spinner
  const buttonClassName = variant === "secondary"
    ? `${$.button} ${$.secondary}`
    : `${$.button} ${$.primary}`;

  return (
    <button
      className={buttonClassName}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading && <span data-testid="loading-spinner" className={$.spinner} />}
      {children}
    </button>
  );
};

export default Button;
