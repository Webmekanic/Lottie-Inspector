"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { StyledSliderRoot, StyledSliderTrack, StyledSliderRange, StyledSliderThumb } from "../../../styles/UiStyles";

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
