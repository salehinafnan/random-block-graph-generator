import type { Point } from "./types";

interface LineProps {
  from: Point;
  to: Point;
}

export const Line = ({ from, to }: LineProps) => (
  <line
    x1={from.x}
    y1={from.y}
    x2={to.x}
    y2={to.y}
    className="stroke-zinc-300 dark:stroke-zinc-700"
    strokeWidth={1.5}
    strokeLinecap="round"
  />
);
