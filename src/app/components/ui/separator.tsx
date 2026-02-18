"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { StyledSeparator } from "../../../styles/UiStyles";

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {}

function Separator({
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <StyledSeparator
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
