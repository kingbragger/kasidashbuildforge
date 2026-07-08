import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const RiseIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  from?: number;
}> = ({ children, delay = 0, style, from = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  const y = interpolate(s, [0, 1], [from, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  return (
    <div style={{ transform: `translateY(${y}px)`, opacity, ...style }}>{children}</div>
  );
};

export const CharsIn: React.FC<{ text: string; delay?: number; style?: React.CSSProperties }> = ({
  text,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", ...style }}>
      {text.split("").map((ch, i) => {
        const s = spring({
          frame: frame - delay - i * 1.2,
          fps,
          config: { damping: 18, stiffness: 140 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
              opacity: interpolate(s, [0, 1], [0, 1]),
              whiteSpace: "pre",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
