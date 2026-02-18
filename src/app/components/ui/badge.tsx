import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { StyledBadge } from "../../../styles/UiStyles";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

function Badge({
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : StyledBadge;

  if (asChild) {
    return <Comp data-slot="badge" {...props} />;
  }

  return (
    <StyledBadge
      data-slot="badge"
      $variant={variant}
      {...props}
    />
  );
}

export { Badge };
