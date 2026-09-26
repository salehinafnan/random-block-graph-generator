import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Point, Size } from "./types";

const MIN_SIZE = 100;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

interface BlockProps {
  id: number;
  position: Point;
  size: Size;
  deletable: boolean;
  onAddBlock: (parentId: number) => void;
  onDeleteBlock: (id: number) => void;
  onMoveBlock: (id: number, position: Point) => void;
  onResizeBlock: (id: number, size: Size) => void;
}

type Gesture = "move" | "resize";

export const Block = ({
  id,
  position,
  size,
  deletable,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock,
  onResizeBlock,
}: BlockProps) => {
  const [gesture, setGesture] = useState<Gesture | null>(null);
  // Active pointer and its offset from the top-left (move) or bottom-right (resize) corner
  const pointer = useRef({ id: -1, dx: 0, dy: 0 });

  const handlePointerDown = (
    event: PointerEvent<HTMLElement>,
    type: Gesture,
  ) => {
    if (
      gesture ||
      event.button !== 0 ||
      (event.target as Element).closest("button")
    ) {
      return;
    }
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const corner =
      type === "move"
        ? position
        : { x: position.x + size.width, y: position.y + size.height };
    pointer.current = {
      id: event.pointerId,
      dx: event.clientX - corner.x,
      dy: event.clientY - corner.y,
    };
    setGesture(type);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerId !== pointer.current.id) return;
    const x = event.clientX - pointer.current.dx;
    const y = event.clientY - pointer.current.dy;

    if (gesture === "move") {
      onMoveBlock(id, {
        x: clamp(x, 0, window.innerWidth - size.width),
        y: clamp(y, 0, window.innerHeight - size.height),
      });
    } else if (gesture === "resize") {
      onResizeBlock(id, {
        width: clamp(x - position.x, MIN_SIZE, window.innerWidth - position.x),
        height: clamp(
          y - position.y,
          MIN_SIZE,
          window.innerHeight - position.y,
        ),
      });
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerId === pointer.current.id) setGesture(null);
  };

  return (
    <div
      className={`absolute flex touch-none flex-col items-center justify-between p-2.5 text-white select-none ${
        gesture === "move"
          ? "cursor-grabbing bg-[red]"
          : "cursor-grab bg-[darkgrey]"
      } ${gesture ? "z-20" : "z-10"}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      onPointerDown={(event) => handlePointerDown(event, "move")}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
    >
      <div>{id}</div>
      <div className="flex h-2/5 w-[70%] items-center justify-center bg-white">
        <button
          type="button"
          aria-label="Add child block"
          className="mx-2.5 cursor-pointer text-[2em] text-black"
          onClick={() => onAddBlock(id)}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Delete block"
          className="mx-2.5 cursor-pointer text-[2em] text-black disabled:cursor-not-allowed disabled:opacity-30"
          disabled={!deletable}
          onClick={() => onDeleteBlock(id)}
        >
          -
        </button>
      </div>
      <div
        className="absolute right-0 bottom-0 size-2.5 cursor-nwse-resize bg-black"
        onPointerDown={(event) => handlePointerDown(event, "resize")}
      />
    </div>
  );
};
