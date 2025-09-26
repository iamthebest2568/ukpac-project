import React from "react";

interface Uk1ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark";
  fullWidth?: boolean;
}

export default function Uk1Button({
  variant = "primary",
  fullWidth = true,
  children,
  className = "",
  ...rest
}: Uk1ButtonProps) {
  const base = "figma-style1-button";
  const variantClass =
    variant === "primary"
      ? "figma-style1-button--primary"
      : variant === "secondary"
      ? "figma-style1-button--secondary"
      : "figma-style1-button--dark";

  return (
    <button
      {...rest}
      className={`${base} ${variantClass} ${fullWidth ? "w-full" : ""} ${className}`}
      style={rest.style}
    >
      <span className="figma-style1-button-text">{children}</span>
    </button>
  );
}
