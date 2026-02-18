import * as React from "react";
import { StyledInput } from "../../../styles/UiStyles";

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
