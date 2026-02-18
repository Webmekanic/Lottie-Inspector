import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { StyledButton } from "../../../styles/UiStyles";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

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
