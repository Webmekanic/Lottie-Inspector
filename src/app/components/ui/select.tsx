"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import {
  StyledSelectTrigger,
  SelectIconWrapper,
  StyledSelectContent,
  StyledSelectViewport,
  StyledSelectLabel,
  StyledSelectItem,
  SelectItemIndicatorWrapper,
  StyledSelectSeparator,
  StyledSelectScrollButton,
} from "../../../styles/UiStyles";

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
