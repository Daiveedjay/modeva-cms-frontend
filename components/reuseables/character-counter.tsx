import React from "react";

export default function CharacterCounter({
  dynamicLength,
  fixedLength,
  className,
}: {
  dynamicLength: number;
  fixedLength: number;
  className?: string;
}) {
  return (
    <p
      className={`text-sm text-muted-foreground text-right ${dynamicLength === fixedLength && " text-destructive!"} ${className}`}
    >
      {dynamicLength} / {fixedLength} characters
    </p>
  );
}
