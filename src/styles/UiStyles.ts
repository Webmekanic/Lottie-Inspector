import styled from "styled-components";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as LabelPrimitive from "@radix-ui/react-label";
import { theme } from "./theme";

// Badge Styles
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface StyledBadgeProps {
  $variant?: BadgeVariant;
}

export const StyledBadge = styled.span<StyledBadgeProps>`
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

// Button Styles
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface StyledButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  white-space: nowrap;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.DEFAULT};
  border: 1px solid transparent;
  outline: none;
  flex-shrink: 0;

  &:disabled {
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

  &:focus-visible {
    border-color: ${theme.colors.blue500};
    box-shadow: 0 0 0 3px ${theme.colors.blue500}33;
  }

  &[aria-invalid="true"] {
    border-color: ${theme.colors.red500};
    box-shadow: 0 0 0 3px ${theme.colors.red500}33;
  }

  @media (prefers-color-scheme: dark) {
    &[aria-invalid="true"] {
      box-shadow: 0 0 0 3px ${theme.colors.red500}66;
    }
  }

  ${(props) => {
    // Size styles
    let sizeStyles = "";
    switch (props.$size) {
      case "sm":
        sizeStyles = `
          height: ${theme.spacing[8]};
          padding: 0 ${theme.spacing[3]};
          gap: ${theme.spacing[1.5]};

          &:has(> svg) {
            padding: 0 ${theme.spacing[2.5]};
          }
        `;
        break;
      case "lg":
        sizeStyles = `
          height: ${theme.spacing[10]};
          padding: 0 ${theme.spacing[6]};

          &:has(> svg) {
            padding: 0 ${theme.spacing[4]};
          }
        `;
        break;
      case "icon":
        sizeStyles = `
          width: ${theme.spacing[9]};
          height: ${theme.spacing[9]};
        `;
        break;
      default: // "default"
        sizeStyles = `
          height: ${theme.spacing[9]};
          padding: ${theme.spacing[2]} ${theme.spacing[4]};

          &:has(> svg) {
            padding: 0 ${theme.spacing[3]};
          }
        `;
    }

    // Variant styles
    let variantStyles = "";
    switch (props.$variant) {
      case "destructive":
        variantStyles = `
          background-color: ${theme.colors.red500};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
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
        break;
      case "outline":
        variantStyles = `
          background-color: ${theme.colors.gray900};
          color: ${theme.colors.gray100};
          border-color: ${theme.colors.gray700};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray800};
            color: ${theme.colors.gray100};
          }

          @media (prefers-color-scheme: dark) {
            background-color: ${theme.colors.gray700}4D;
            border-color: ${theme.colors.gray700};

            &:hover:not(:disabled) {
              background-color: ${theme.colors.gray700}80;
            }
          }
        `;
        break;
      case "secondary":
        variantStyles = `
          background-color: ${theme.colors.gray700};
          color: ${theme.colors.gray100};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray600};
          }
        `;
        break;
      case "ghost":
        variantStyles = `
          background-color: transparent;
          color: ${theme.colors.gray100};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray800};
            color: ${theme.colors.gray100};
          }

          @media (prefers-color-scheme: dark) {
            &:hover:not(:disabled) {
              background-color: ${theme.colors.gray800}80;
            }
          }
        `;
        break;
      case "link":
        variantStyles = `
          background-color: transparent;
          color: ${theme.colors.blue500};
          text-decoration: underline;
          text-underline-offset: 4px;

          &:hover:not(:disabled) {
            text-decoration: underline;
          }
        `;
        break;
      default: // "default"
        variantStyles = `
          background-color: ${theme.colors.blue500};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue600};
          }
        `;
    }

    return sizeStyles + variantStyles;
  }}
`;

// Input Styles
export const StyledInput = styled.input`
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

  /* Number input spinner controls */
  &[type="number"] {
    -moz-appearance: textfield; /* Firefox */
    appearance: textfield;
  }

  /* WebKit browsers (Chrome, Safari, Edge) */
  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

// Label Styles
export const StyledLabel = styled(LabelPrimitive.Root)`
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

// Select Styles
export const StyledSelectTrigger = styled(SelectPrimitive.Trigger)<{ $size?: "sm" | "default" }>`
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

export const SelectIconWrapper = styled.span`
  font-size: 1rem;
  opacity: 0.5;
`;

export const StyledSelectContent = styled(SelectPrimitive.Content)<{ $position?: string }>`
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

export const StyledSelectViewport = styled(SelectPrimitive.Viewport)<{ $position?: string }>`
  padding: ${theme.spacing[1]};

  ${(props) => props.$position === "popper" && `
    height: var(--radix-select-trigger-height);
    width: 100%;
    min-width: var(--radix-select-trigger-width);
    scroll-margin: ${theme.spacing[1]};
  `}
`;

export const StyledSelectLabel = styled(SelectPrimitive.Label)`
  padding: ${theme.spacing[1.5]} ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray500};
`;

export const StyledSelectItem = styled(SelectPrimitive.Item)`
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

export const SelectItemIndicatorWrapper = styled.span`
  position: absolute;
  right: ${theme.spacing[2]};
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

export const StyledSelectSeparator = styled(SelectPrimitive.Separator)`
  margin: ${theme.spacing[1]} -${theme.spacing[1]};
  height: 1px;
  background-color: ${theme.colors.gray700};
  pointer-events: none;
`;

export const StyledSelectScrollButton = styled.div`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[1]} 0;
`;

// Separator Styles
export const StyledSeparator = styled(SeparatorPrimitive.Root)`
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

// Slider Styles
export const StyledSliderRoot = styled(SliderPrimitive.Root)`
  position: relative;
  display: flex;
  width: 100%;
  touch-action: none;
  align-items: center;
  user-select: none;

  &[data-disabled] {
    opacity: 0.5;
  }

  &[data-orientation="vertical"] {
    height: 100%;
    min-height: 11rem;
    width: auto;
    flex-direction: column;
  }
`;

export const StyledSliderTrack = styled(SliderPrimitive.Track)`
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.gray800};

  &[data-orientation="horizontal"] {
    height: ${theme.spacing[4]};
    width: 100%;
  }

  &[data-orientation="vertical"] {
    height: 100%;
    width: ${theme.spacing[1.5]};
  }
`;

export const StyledSliderRange = styled(SliderPrimitive.Range)`
  position: absolute;
  background-color: ${theme.colors.blue500};

  &[data-orientation="horizontal"] {
    height: 100%;
  }

  &[data-orientation="vertical"] {
    width: 100%;
  }
`;

export const StyledSliderThumb = styled(SliderPrimitive.Thumb)`
  display: block;
  width: ${theme.spacing[4]};
  height: ${theme.spacing[4]};
  flex-shrink: 0;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${theme.colors.blue500};
  background-color: ${theme.colors.gray900};
  box-shadow: ${theme.shadows.sm};
  transition: color ${theme.transitions.DEFAULT}, box-shadow ${theme.transitions.DEFAULT};

  &:hover {
    box-shadow: 0 0 0 4px ${theme.colors.blue500}33;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.colors.blue500}33;
    outline: none;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

// Switch Styles
export const StyledSwitchRoot = styled(SwitchPrimitive.Root)`
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

export const StyledSwitchThumb = styled(SwitchPrimitive.Thumb)`
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

// App Container Styles
export const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.gray950};
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;
