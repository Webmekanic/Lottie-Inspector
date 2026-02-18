"use client";

import * as React from "react";
import styled from "styled-components";
import * as LabelPrimitive from "@radix-ui/react-label";
import { theme } from "../../../styles/theme";

const StyledLabel = styled(LabelPrimitive.Root)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.sm};
  line-height: 1;
  font-weight: ${theme.typography.fontWeight.medium};
  user-select: none;

  &[data-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:has(+ :disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

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
