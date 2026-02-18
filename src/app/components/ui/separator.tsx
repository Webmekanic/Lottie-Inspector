"use client";

import * as React from "react";
import styled from "styled-components";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { theme } from "../../../styles/theme";

const StyledSeparator = styled(SeparatorPrimitive.Root)`
  flex-shrink: 0;
  background-color: ${theme.colors.gray700};

  &[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
  }

  &[data-orientation="vertical"] {
    height: 100%;
    width: 1px;
  }
`;

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
