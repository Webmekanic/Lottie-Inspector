import * as React from "react";
import styled from "styled-components";
import { theme } from "../../../styles/theme";

const StyledInput = styled.input`
  display: flex;
  height: ${theme.spacing[9]};
  width: 100%;
  min-width: 0;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.gray700};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.base};
  background-color: ${theme.colors.gray900};
  color: ${theme.colors.gray100};
  transition: color ${theme.transitions.DEFAULT}, box-shadow ${theme.transitions.DEFAULT};
  outline: none;

  @media (min-width: 768px) {
    font-size: ${theme.typography.fontSize.sm};
  }

  &::placeholder {
    color: ${theme.colors.gray500};
  }

  &::selection {
    background-color: ${theme.colors.blue500};
    color: ${theme.colors.white};
  }

  &::file-selector-button {
    display: inline-flex;
    height: ${theme.spacing[7]};
    border: 0;
    background-color: transparent;
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.gray100};
  }

  &:focus-visible {
    border-color: ${theme.colors.blue500};
    box-shadow: 0 0 0 3px ${theme.colors.blue500}33;
  }

  &[aria-invalid="true"] {
    border-color: ${theme.colors.red500};
    box-shadow: 0 0 0 3px ${theme.colors.red500}33;
  }

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${theme.colors.gray700}4D;

    &[aria-invalid="true"] {
      box-shadow: 0 0 0 3px ${theme.colors.red500}66;
    }
  }
`;

interface InputProps extends React.ComponentProps<"input"> {}

function Input({ type, ...props }: InputProps) {
  return (
    <StyledInput
      type={type}
      data-slot="input"
      {...props}
    />
  );
}

export { Input };
