import type { Size } from "./types";

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export const getSize = (element: Element): Size => ({
  width: element.clientWidth,
  height: element.clientHeight,
});
