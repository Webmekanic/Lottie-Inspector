"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { StyledLabel } from "../../../styles/UiStyles";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {}

function Label({ ...props }: LabelProps) {
  return (
    <StyledLabel
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
