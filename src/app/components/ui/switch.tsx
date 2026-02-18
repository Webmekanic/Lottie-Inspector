"use client";

import * as React from "react";
import styled from "styled-components";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { theme } from "../../../styles/theme";

const StyledSwitchRoot = styled(SwitchPrimitive.Root)`
  display: inline-flex;
  height: 1.15rem;
  width: ${theme.spacing[8]};
  flex-shrink: 0;
  align-items: center;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid transparent;
  transition: all ${theme.transitions.DEFAULT};
  outline: none;

  &[data-state="checked"] {
    background-color: ${theme.colors.blue500};
  }

  &[data-state="unchecked"] {
    background-color: ${theme.colors.gray700};
  }

  &:focus-visible {
    border-color: ${theme.colors.blue500};
    box-shadow: 0 0 0 3px ${theme.colors.blue500}33;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-color-scheme: dark) {
    &[data-state="unchecked"] {
      background-color: ${theme.colors.gray700}CC;
    }
  }
`;

const StyledSwitchThumb = styled(SwitchPrimitive.Thumb)`
  pointer-events: none;
  display: block;
  width: ${theme.spacing[4]};
  height: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.white};
  box-shadow: 0 0 0 0 transparent;
  transition: transform ${theme.transitions.DEFAULT};

  &[data-state="checked"] {
    transform: translateX(calc(100% - 2px));
  }

  &[data-state="unchecked"] {
    transform: translateX(0);
  }

  @media (prefers-color-scheme: dark) {
    &[data-state="unchecked"] {
      background-color: ${theme.colors.gray100};
    }

    &[data-state="checked"] {
      background-color: ${theme.colors.white};
    }
  }
`;

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
