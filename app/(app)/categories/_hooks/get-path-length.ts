// utils/get-path-length.ts

/**
 * Returns the length of an SVG path string.
 * Returns 1000 as a fallback for SSR/Node or on error.
 */
export function getPathLength(path: string): number {
  // SSR or non-browser fallback
  if (typeof document === "undefined") return 1000;
  try {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    pathElement.setAttribute("d", path);
    svg.appendChild(pathElement);
    document.body.appendChild(svg);
    const length = pathElement.getTotalLength();
    document.body.removeChild(svg);
    return length;
  } catch {
    return 1000;
  }
}
