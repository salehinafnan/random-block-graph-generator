import type { Point } from "./types";

interface LineProps {
  from: Point;
  to: Point;
}

export const Line = ({ from, to }: LineProps) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  return (
    <div
      className="pointer-events-none absolute z-0 origin-top-left border-t-2 border-dashed border-black"
      style={{
        left: from.x,
        top: from.y,
        width: Math.hypot(dx, dy),
        transform: `rotate(${Math.atan2(dy, dx)}rad)`,
      }}
    />
  );
};
