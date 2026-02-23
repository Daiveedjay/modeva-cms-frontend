import { AnimatePresence, motion } from "motion/react";
import { BoxPositions, getConnectionPath } from "../_hooks/get-connection-path";
import { getPathLength } from "../_hooks/get-path-length";
import { Connection } from "../_modals/reassign-sub-categories-modal";
import { useMemo } from "react";

interface PathData {
  id: string;
  d: string;
  length: number;
}

export const ReassignmentLines = ({
  connections,
  boxPositions,
}: {
  connections: Connection[];
  boxPositions: BoxPositions;
}) => {
  const paths: PathData[] = useMemo(() => {
    return connections
      .map((connection) => {
        const parentPos = boxPositions.parent[connection.parentId];
        if (!parentPos) return null;

        const d = getConnectionPath(
          boxPositions,
          connection.subId,
          connection.parentId,
        );
        const length = getPathLength(d);

        return {
          id: connection.id,
          d,
          length,
        };
      })
      .filter(Boolean) as PathData[];
  }, [connections, boxPositions]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: "100%", height: "100%" }}>
      <AnimatePresence>
        {paths.map((path) => (
          <g key={path.id}>
            <motion.path
              d={path.d}
              stroke="oklch(0.92 0.07 76.67)"
              strokeWidth="3"
              fill="none"
              initial={{
                strokeDasharray: path.length,
                strokeDashoffset: path.length,
              }}
              animate={{
                strokeDashoffset: 0,
              }}
              exit={{
                strokeDashoffset: path.length,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </AnimatePresence>
    </svg>
  );
};
