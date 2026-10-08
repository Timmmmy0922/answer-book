import type { CSSProperties } from "react";

/** 给 .rise 元素排队入场：style={stagger(0)} */
export function stagger(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}
