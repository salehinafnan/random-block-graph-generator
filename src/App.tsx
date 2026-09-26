import { useEffect, useRef, useState } from "react";
import { Block } from "./Block";
import { GitHubIcon, LogoIcon, ResetIcon } from "./Icons";
import { Line } from "./Line";
import type { BlockData, Point, Size } from "./types";
import { clamp, getSize } from "./utils";

const BLOCK_SIZE: Size = { width: 100, height: 100 };
const HEADER_HEIGHT = 56;
const PADDING = 16;
const REPO_URL = "https://github.com/salehinafnan/random-block-graph-generator";

// The root block starts centered, children are placed randomly away from the edges
const createBlock = (
  id: number,
  parentId: number | null,
  bounds: Size,
): BlockData => {
  const place = (space: number) =>
    parentId === null
      ? space / 2
      : PADDING + Math.random() * Math.max(0, space - 2 * PADDING);
  return {
    id,
    parentId,
    position: {
      x: place(bounds.width - BLOCK_SIZE.width),
      y: place(bounds.height - BLOCK_SIZE.height),
    },
    size: BLOCK_SIZE,
  };
};

const getCenter = ({ position, size }: BlockData): Point => ({
  x: position.x + size.width / 2,
  y: position.y + size.height / 2,
});

const getSubtreeIds = (blocks: BlockData[], id: number): number[] => [
  id,
  ...blocks
    .filter((block) => block.parentId === id)
    .flatMap((child) => getSubtreeIds(blocks, child.id)),
];

export const App = () => {
  const canvas = useRef<HTMLElement>(null);
  const nextId = useRef(1);
  const [blocks, setBlocks] = useState(() => [
    createBlock(0, null, {
      width: window.innerWidth,
      height: window.innerHeight - HEADER_HEIGHT,
    }),
  ]);

  // Keep every block inside the canvas when the window shrinks
  useEffect(() => {
    const handleResize = () => {
      const { width, height } = getSize(canvas.current!);
      setBlocks((blocks) =>
        blocks.map((block) => ({
          ...block,
          position: {
            x: clamp(block.position.x, 0, width - block.size.width),
            y: clamp(block.position.y, 0, height - block.size.height),
          },
        })),
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateBlock = (id: number, changes: Partial<BlockData>) => {
    setBlocks((blocks) =>
      blocks.map((block) =>
        block.id === id ? { ...block, ...changes } : block,
      ),
    );
  };

  const handleAddBlock = (parentId: number) => {
    const block = createBlock(
      nextId.current++,
      parentId,
      getSize(canvas.current!),
    );
    setBlocks((blocks) => [...blocks, block]);
  };

  const handleDeleteBlock = (id: number) => {
    setBlocks((blocks) => {
      const ids = new Set(getSubtreeIds(blocks, id));
      return blocks.filter((block) => !ids.has(block.id));
    });
  };

  const handleMoveBlock = (id: number, position: Point) => {
    updateBlock(id, { position });
  };

  const handleResizeBlock = (id: number, size: Size) => {
    updateBlock(id, { size });
  };

  const handleReset = () => {
    nextId.current = 1;
    setBlocks([createBlock(0, null, getSize(canvas.current!))]);
  };

  return (
    <div className="flex h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      <header
        className="flex shrink-0 items-center gap-2.5 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="grid size-7 place-items-center rounded-lg bg-indigo-600 text-white">
          <LogoIcon className="size-4" />
        </div>
        <h1 className="truncate text-sm font-semibold tracking-tight">
          Random Block Graph
        </h1>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums dark:bg-zinc-800 dark:text-zinc-400">
          {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
        </span>
        <p className="ml-auto hidden text-xs text-zinc-500 md:block">
          Drag to move · Drag the corner to resize
        </p>
        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-3">
          <button
            type="button"
            aria-label="Reset graph"
            title="Reset graph"
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-zinc-600 transition-colors outline-none hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            onClick={handleReset}
          >
            <ResetIcon className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            title="View source on GitHub"
            className="grid size-8 place-items-center rounded-md text-zinc-500 transition-colors outline-none hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <GitHubIcon className="size-4" />
          </a>
        </div>
      </header>
      <main ref={canvas} className="relative flex-1 overflow-hidden bg-dots">
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden="true"
        >
          {blocks.map((block) => {
            const parent = blocks.find((b) => b.id === block.parentId);
            return parent ? (
              <Line
                key={block.id}
                from={getCenter(parent)}
                to={getCenter(block)}
              />
            ) : null;
          })}
        </svg>
        {blocks.map((block) => (
          <Block
            key={block.id}
            id={block.id}
            parentId={block.parentId}
            position={block.position}
            size={block.size}
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onResizeBlock={handleResizeBlock}
          />
        ))}
      </main>
    </div>
  );
};
