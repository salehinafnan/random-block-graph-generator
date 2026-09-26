import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { GripIcon, MinusIcon, PlusIcon } from "./Icons";
import type { Point, Size } from "./types";
import { clamp, getSize } from "./utils";

const MIN_SIZE = 100;

const ICON_BUTTON =
  "grid size-6 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-400";

interface BlockProps {
  id: number;
  parentId: number | null;
  position: Point;
  size: Size;
  onAddBlock: (parentId: number) => void;
  onDeleteBlock: (id: number) => void;
  onMoveBlock: (id: number, position: Point) => void;
  onResizeBlock: (id: number, size: Size) => void;
}

type Gesture = "move" | "resize";

export const Block = ({
  id,
  parentId,
  position,
  size,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock,
  onResizeBlock,
}: BlockProps) => {
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  // Active pointer, its offset from the top-left (move) or bottom-right (resize) corner, and the canvas size
  const pointer = useRef({
    id: -1,
    dx: 0,
    dy: 0,
    bounds: { width: 0, height: 0 },
  });

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
      bounds: getSize(ref.current!.offsetParent!),
    };
    setGesture(type);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const { id: pointerId, dx, dy, bounds } = pointer.current;
    if (event.pointerId !== pointerId) return;
    const x = event.clientX - dx;
    const y = event.clientY - dy;

    if (gesture === "move") {
      onMoveBlock(id, {
        x: clamp(x, 0, bounds.width - size.width),
        y: clamp(y, 0, bounds.height - size.height),
      });
    } else if (gesture === "resize") {
      onResizeBlock(id, {
        width: clamp(x - position.x, MIN_SIZE, bounds.width - position.x),
        height: clamp(y - position.y, MIN_SIZE, bounds.height - position.y),
      });
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerId === pointer.current.id) setGesture(null);
  };

  return (
    <div
      ref={ref}
      className={`group absolute flex animate-pop touch-none flex-col justify-between rounded-xl border bg-white p-2 transition-[border-color,box-shadow] select-none dark:bg-zinc-900 ${
        gesture
          ? "z-20 border-indigo-500 shadow-lg ring-4 ring-indigo-500/15 dark:ring-indigo-500/25"
          : "z-10 border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
      } ${gesture === "move" ? "cursor-grabbing" : "cursor-grab"}`}
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
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 pl-1 text-xs font-semibold tabular-nums">
          {parentId === null && (
            <span className="size-1.5 rounded-full bg-indigo-500" />
          )}
          #{id}
        </span>
        <div className="flex">
          <button
            type="button"
            aria-label="Add child block"
            title="Add child block"
            className={`${ICON_BUTTON} hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100`}
            onClick={() => onAddBlock(id)}
          >
            <PlusIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Delete block"
            title="Delete block"
            className={`${ICON_BUTTON} enabled:hover:bg-red-50 enabled:hover:text-red-600 dark:enabled:hover:bg-red-500/10 dark:enabled:hover:text-red-400`}
            disabled={parentId === null}
            onClick={() => onDeleteBlock(id)}
          >
            <MinusIcon className="size-4" />
          </button>
        </div>
      </div>
      <span className="truncate pr-3 pl-1 text-[11px] text-zinc-400 dark:text-zinc-500">
        {parentId === null ? "Root" : `Child of #${parentId}`}
      </span>
      <div
        className="absolute right-0 bottom-0 grid size-5 cursor-nwse-resize place-items-center text-zinc-300 transition-colors group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400"
        onPointerDown={(event) => handlePointerDown(event, "resize")}
      >
        <GripIcon className="size-2.5" />
      </div>
    </div>
  );
};
