import * as React from "react";
import styled from "styled-components";
import { Slot } from "@radix-ui/react-slot";
import { theme } from "../../../styles/theme";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface StyledBadgeProps {
  $variant?: BadgeVariant;
}

const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  border-width: 1px;
  border-style: solid;
  padding: ${theme.spacing[0.5]} ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  gap: ${theme.spacing[1]};
  overflow: hidden;
  transition: color ${theme.transitions.DEFAULT}, box-shadow ${theme.transitions.DEFAULT};
  outline: none;

  & > svg {
    width: 0.75rem;
    height: 0.75rem;
    pointer-events: none;
  }

  &:focus-visible {
    border-color: ${theme.colors.blue500};
    box-shadow: 0 0 0 3px ${theme.colors.blue500}33;
  }

  &[aria-invalid="true"] {
    border-color: ${theme.colors.red500};
    box-shadow: 0 0 0 3px ${theme.colors.red500}33;
  }

  ${(props) => {
    switch (props.$variant) {
      case "secondary":
        return `
          border-color: transparent;
          background-color: ${theme.colors.gray700};
          color: ${theme.colors.gray100};

          a &:hover {
            background-color: ${theme.colors.gray600};
          }
        `;
      case "destructive":
        return `
          border-color: transparent;
          background-color: ${theme.colors.red500};
          color: ${theme.colors.white};

          a &:hover {
            background-color: ${theme.colors.red600};
          }

          &:focus-visible {
            box-shadow: 0 0 0 3px ${theme.colors.red500}33;
          }

          @media (prefers-color-scheme: dark) {
            background-color: ${theme.colors.red500}99;
            
            &:focus-visible {
              box-shadow: 0 0 0 3px ${theme.colors.red500}66;
            }
          }
        `;
      case "outline":
        return `
          color: ${theme.colors.gray100};

          a &:hover {
            background-color: ${theme.colors.gray800};
            color: ${theme.colors.gray100};
          }
        `;
      default: // "default"
        return `
          border-color: transparent;
          background-color: ${theme.colors.blue500};
          color: ${theme.colors.white};

          a &:hover {
            background-color: ${theme.colors.blue600};
          }
        `;
    }
  }}
`;

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
