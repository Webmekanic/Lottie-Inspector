"use client";

import * as React from "react";
import styled from "styled-components";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { theme } from "../../../styles/theme";

const StyledSliderRoot = styled(SliderPrimitive.Root)`
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

const StyledSliderTrack = styled(SliderPrimitive.Track)`
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

const StyledSliderRange = styled(SliderPrimitive.Range)`
  position: absolute;
  background-color: ${theme.colors.blue500};

  &[data-orientation="horizontal"] {
    height: 100%;
  }

  &[data-orientation="vertical"] {
    width: 100%;
  }
`;

const StyledSliderThumb = styled(SliderPrimitive.Thumb)`
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

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {}

function Slider({
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <StyledSliderRoot
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      {...props}
    >
      <StyledSliderTrack data-slot="slider-track">
        <StyledSliderRange data-slot="slider-range" />
      </StyledSliderTrack>
      {Array.from({ length: _values.length }, (_, index) => (
        <StyledSliderThumb
          data-slot="slider-thumb"
          key={index}
        />
      ))}
    </StyledSliderRoot>
  );
}

export { Slider };
