import * as React from "react";
import styled from "styled-components";
import { Slot } from "@radix-ui/react-slot";
import { theme } from "../../../styles/theme";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface StyledButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  white-space: nowrap;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.DEFAULT};
  border: 1px solid transparent;
  outline: none;
  flex-shrink: 0;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }

  &:focus-visible {
    border-color: ${theme.colors.blue500};
    box-shadow: 0 0 0 3px ${theme.colors.blue500}33;
  }

  &[aria-invalid="true"] {
    border-color: ${theme.colors.red500};
    box-shadow: 0 0 0 3px ${theme.colors.red500}33;
  }

  @media (prefers-color-scheme: dark) {
    &[aria-invalid="true"] {
      box-shadow: 0 0 0 3px ${theme.colors.red500}66;
    }
  }

  ${(props) => {
    // Size styles
    let sizeStyles = "";
    switch (props.$size) {
      case "sm":
        sizeStyles = `
          height: ${theme.spacing[8]};
          padding: 0 ${theme.spacing[3]};
          gap: ${theme.spacing[1.5]};

          &:has(> svg) {
            padding: 0 ${theme.spacing[2.5]};
          }
        `;
        break;
      case "lg":
        sizeStyles = `
          height: ${theme.spacing[10]};
          padding: 0 ${theme.spacing[6]};

          &:has(> svg) {
            padding: 0 ${theme.spacing[4]};
          }
        `;
        break;
      case "icon":
        sizeStyles = `
          width: ${theme.spacing[9]};
          height: ${theme.spacing[9]};
        `;
        break;
      default: // "default"
        sizeStyles = `
          height: ${theme.spacing[9]};
          padding: ${theme.spacing[2]} ${theme.spacing[4]};

          &:has(> svg) {
            padding: 0 ${theme.spacing[3]};
          }
        `;
    }

    // Variant styles
    let variantStyles = "";
    switch (props.$variant) {
      case "destructive":
        variantStyles = `
          background-color: ${theme.colors.red500};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.red600};
          }

          &:focus-visible {
            box-shadow: 0 0 0 3px ${theme.colors.red500}33;
          }

          @media (prefers-color-scheme: dark) {
            background-color: ${theme.colors.red500}99;

            &:focus-visible {
              box-shadow: 0 0 0 3px ${theme.colors.red500}66;
            }
          }
        `;
        break;
      case "outline":
        variantStyles = `
          background-color: ${theme.colors.gray900};
          color: ${theme.colors.gray100};
          border-color: ${theme.colors.gray700};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray800};
            color: ${theme.colors.gray100};
          }

          @media (prefers-color-scheme: dark) {
            background-color: ${theme.colors.gray700}4D;
            border-color: ${theme.colors.gray700};

            &:hover:not(:disabled) {
              background-color: ${theme.colors.gray700}80;
            }
          }
        `;
        break;
      case "secondary":
        variantStyles = `
          background-color: ${theme.colors.gray700};
          color: ${theme.colors.gray100};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray600};
          }
        `;
        break;
      case "ghost":
        variantStyles = `
          background-color: transparent;
          color: ${theme.colors.gray100};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray800};
            color: ${theme.colors.gray100};
          }

          @media (prefers-color-scheme: dark) {
            &:hover:not(:disabled) {
              background-color: ${theme.colors.gray800}80;
            }
          }
        `;
        break;
      case "link":
        variantStyles = `
          background-color: transparent;
          color: ${theme.colors.blue500};
          text-decoration: underline;
          text-underline-offset: 4px;

          &:hover:not(:disabled) {
            text-decoration: underline;
          }
        `;
        break;
      default: // "default"
        variantStyles = `
          background-color: ${theme.colors.blue500};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue600};
          }
        `;
    }

    return sizeStyles + variantStyles;
  }}
`;

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

function Button({
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : StyledButton;

  if (asChild) {
    return <Comp data-slot="button" {...props} />;
  }

  return (
    <StyledButton
      data-slot="button"
      $variant={variant}
      $size={size}
      {...props}
    />
  );
}

export { Button };
