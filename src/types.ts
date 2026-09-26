export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BlockData {
  id: number;
  parentId: number | null;
  position: Point;
  size: Size;
}
