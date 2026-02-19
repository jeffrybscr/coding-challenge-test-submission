import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import styles from "./Button.module.css";

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
  const buttonClassName = variant === "secondary"
    ? `${styles.button} ${styles.secondary}`
    : `${styles.button} ${styles.primary}`;

  return (
    <button
      className={buttonClassName}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading && <span data-testid="loading-spinner" className={styles.spinner} />}
      {children}
    </button>
  );
};

export default Button;
