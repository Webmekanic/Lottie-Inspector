"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { StyledSwitchRoot, StyledSwitchThumb } from "../../../styles/UiStyles";

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {}

function Switch({ ...props }: SwitchProps) {
  return (
    <StyledSwitchRoot
      data-slot="switch"
      {...props}
    >
      <StyledSwitchThumb data-slot="switch-thumb" />
    </StyledSwitchRoot>
  );
}

export { Switch };
