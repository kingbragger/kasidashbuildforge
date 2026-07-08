import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate, useVideoConfig } from "remotion";

// Wraps a screenshot in a stylised phone frame with scroll animation.
export const PhoneFrame: React.FC<{
  shots: string[]; // static file paths
  width?: number;
  scrollDuration?: number; // frames per shot
}> = ({ shots, width = 520, scrollDuration = 90 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const height = width * (900 / 480); // preserve viewport ratio
  const idxFloat = Math.min(shots.length - 1, frame / scrollDuration);
  const idx = Math.floor(idxFloat);
  const next = Math.min(shots.length - 1, idx + 1);
  const localT = idxFloat - idx;

  const pop = interpolate(frame, [0, 20], [0.92, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 52,
        padding: 14,
        background: "linear-gradient(160deg,#1a1d24,#0a0c11)",
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.06), 0 0 80px rgba(255,122,0,0.25)",
        transform: `scale(${pop})`,
        opacity,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 40,
          overflow: "hidden",
          position: "relative",
          background: "#000",
        }}
      >
        <Img
          src={staticFile(shots[idx])}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 1 - localT,
          }}
        />
        <Img
          src={staticFile(shots[next])}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: localT,
          }}
        />
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 110,
            height: 26,
            borderRadius: 20,
            background: "#000",
          }}
        />
      </div>
    </div>
  );
};
