import { useRef, useState } from "react";
import { Block } from "./Block";
import { Line } from "./Line";
import type { BlockData, Point, Size } from "./types";

const BLOCK_SIZE: Size = { width: 100, height: 100 };

const createBlock = (id: number, parentId: number | null): BlockData => ({
  id,
  parentId,
  position: {
    x: Math.random() * Math.max(0, window.innerWidth - BLOCK_SIZE.width),
    y: Math.random() * Math.max(0, window.innerHeight - BLOCK_SIZE.height),
  },
  size: BLOCK_SIZE,
});

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
  const [blocks, setBlocks] = useState(() => [createBlock(0, null)]);
  const nextId = useRef(1);

  const updateBlock = (id: number, changes: Partial<BlockData>) => {
    setBlocks((blocks) =>
      blocks.map((block) =>
        block.id === id ? { ...block, ...changes } : block,
      ),
    );
  };

  const handleAddBlock = (parentId: number) => {
    const block = createBlock(nextId.current++, parentId);
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

  return (
    <div>
      {blocks.map((block) => (
        <Block
          key={block.id}
          id={block.id}
          position={block.position}
          size={block.size}
          deletable={block.parentId !== null}
          onAddBlock={handleAddBlock}
          onDeleteBlock={handleDeleteBlock}
          onMoveBlock={handleMoveBlock}
          onResizeBlock={handleResizeBlock}
        />
      ))}
      {blocks.map((block) => {
        const parent = blocks.find((b) => b.id === block.parentId);
        return parent ? (
          <Line key={block.id} from={getCenter(parent)} to={getCenter(block)} />
        ) : null;
      })}
    </div>
  );
};
