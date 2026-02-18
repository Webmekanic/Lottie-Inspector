"use client";

import * as React from "react";
import styled from "styled-components";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { theme } from "../../../styles/theme";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

const StyledSelectTrigger = styled(SelectPrimitive.Trigger)<{ $size?: "sm" | "default" }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.gray700};
  background-color: ${theme.colors.gray900};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.sm};
  white-space: nowrap;
  transition: color ${theme.transitions.DEFAULT}, box-shadow ${theme.transitions.DEFAULT};
  outline: none;
  color: ${theme.colors.gray100};
  height: ${(props) => props.$size === "sm" ? theme.spacing[8] : theme.spacing[9]};

  &[data-placeholder] {
    color: ${theme.colors.gray500};
  }

  & svg:not([class*='text-']) {
    color: ${theme.colors.gray500};
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
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
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${theme.colors.gray700}4D;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray700}80;
    }

    &[aria-invalid="true"] {
      box-shadow: 0 0 0 3px ${theme.colors.red500}66;
    }
  }

  & [data-slot="select-value"] {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const SelectIconWrapper = styled.span`
  font-size: 1rem;
  opacity: 0.5;
`;

function SelectTrigger({
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <StyledSelectTrigger
      data-slot="select-trigger"
      data-size={size}
      $size={size}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <SelectIconWrapper>
          <ChevronDownIcon className="size-4" />
        </SelectIconWrapper>
      </SelectPrimitive.Icon>
    </StyledSelectTrigger>
  );
}

const StyledSelectContent = styled(SelectPrimitive.Content)<{ $position?: string }>`
  position: relative;
  z-index: 50;
  max-height: var(--radix-select-content-available-height);
  min-width: 8rem;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.gray700};
  background-color: ${theme.colors.gray900};
  color: ${theme.colors.gray100};
  box-shadow: ${theme.shadows.md};

  &[data-state="open"] {
    animation: fadeIn 150ms ease-out, scaleIn 150ms ease-out;
  }

  &[data-state="closed"] {
    animation: fadeOut 150ms ease-in, scaleOut 150ms ease-in;
  }

  &[data-side="bottom"] {
    ${(props) => props.$position === "popper" && `transform: translateY(${theme.spacing[1]});`}
  }

  &[data-side="left"] {
    ${(props) => props.$position === "popper" && `transform: translateX(-${theme.spacing[1]});`}
  }

  &[data-side="right"] {
    ${(props) => props.$position === "popper" && `transform: translateX(${theme.spacing[1]});`}
  }

  &[data-side="top"] {
    ${(props) => props.$position === "popper" && `transform: translateY(-${theme.spacing[1]});`}
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); }
    to { transform: scale(1); }
  }

  @keyframes scaleOut {
    from { transform: scale(1); }
    to { transform: scale(0.95); }
  }
`;

const StyledSelectViewport = styled(SelectPrimitive.Viewport)<{ $position?: string }>`
  padding: ${theme.spacing[1]};

  ${(props) => props.$position === "popper" && `
    height: var(--radix-select-trigger-height);
    width: 100%;
    min-width: var(--radix-select-trigger-width);
    scroll-margin: ${theme.spacing[1]};
  `}
`;

function SelectContent({
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <StyledSelectContent
        data-slot="select-content"
        position={position}
        $position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <StyledSelectViewport $position={position}>
          {children}
        </StyledSelectViewport>
        <SelectScrollDownButton />
      </StyledSelectContent>
    </SelectPrimitive.Portal>
  );
}

const StyledSelectLabel = styled(SelectPrimitive.Label)`
  padding: ${theme.spacing[1.5]} ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray500};
`;

function SelectLabel({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <StyledSelectLabel
      data-slot="select-label"
      {...props}
    />
  );
}

const StyledSelectItem = styled(SelectPrimitive.Item)`
  position: relative;
  display: flex;
  width: 100%;
  cursor: default;
  user-select: none;
  align-items: center;
  gap: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing[1.5]} ${theme.spacing[2]};
  padding-right: ${theme.spacing[8]};
  font-size: ${theme.typography.fontSize.sm};
  outline: none;

  &:focus {
    background-color: ${theme.colors.gray800};
    color: ${theme.colors.gray100};
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }

  & svg:not([class*='text-']) {
    color: ${theme.colors.gray500};
  }

  & span:last-child {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
  }
`;

const SelectItemIndicatorWrapper = styled.span`
  position: absolute;
  right: ${theme.spacing[2]};
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

function SelectItem({
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <StyledSelectItem
      data-slot="select-item"
      {...props}
    >
      <SelectItemIndicatorWrapper>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </SelectItemIndicatorWrapper>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </StyledSelectItem>
  );
}

const StyledSelectSeparator = styled(SelectPrimitive.Separator)`
  margin: ${theme.spacing[1]} -${theme.spacing[1]};
  height: 1px;
  background-color: ${theme.colors.gray700};
  pointer-events: none;
`;

function SelectSeparator({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <StyledSelectSeparator
      data-slot="select-separator"
      {...props}
    />
  );
}

const StyledSelectScrollButton = styled.div`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[1]} 0;
`;

function SelectScrollUpButton({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      asChild
      {...props}
    >
      <StyledSelectScrollButton>
        <ChevronUpIcon className="size-4" />
      </StyledSelectScrollButton>
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      asChild
      {...props}
    >
      <StyledSelectScrollButton>
        <ChevronDownIcon className="size-4" />
      </StyledSelectScrollButton>
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
