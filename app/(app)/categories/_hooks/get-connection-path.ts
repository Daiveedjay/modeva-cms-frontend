// utils/get-connection-path.ts

export interface BoxPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoxPositions {
  sub: Record<string, BoxPosition>;
  parent: Record<string, BoxPosition>;
}

/**
 * Returns an SVG path string connecting the sub box to the parent box
 */
export function getConnectionPath(
  boxPositions: BoxPositions,
  subId: string,
  parentId: string,
): string {
  const subPos = boxPositions.sub[subId];
  const parentPos = boxPositions.parent[parentId];

  if (!subPos || !parentPos) return "";

  const startX = subPos.x;
  const startY = subPos.y;
  const endX = parentPos.x;
  const endY = parentPos.y;

  // Create a curved path
  const midX = (startX + endX) / 2;
  const controlX1 = startX + (midX - startX) * 0.5;
  const controlX2 = endX - (endX - midX) * 0.5;

  return `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;
}
