import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const KenBurns: React.FC<{
  src: string;
  from?: [number, number, number]; // scale, tx%, ty%
  to?: [number, number, number];
  fadeIn?: number;
  fadeOut?: number;
}> = ({ src, from = [1.05, 0, 0], to = [1.2, -3, -5], fadeIn = 15, fadeOut = 15 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  const scale = interpolate(t, [0, 1], [from[0], to[0]]);
  const tx = interpolate(t, [0, 1], [from[1], to[1]]);
  const ty = interpolate(t, [0, 1], [from[2], to[2]]);
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: "center",
        }}
      />
    </AbsoluteFill>
  );
};
