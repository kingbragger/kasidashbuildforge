import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../theme";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoS = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 90 } });
  const logoScale = interpolate(logoS, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(logoS, [0, 1], [0, 1]);
  const lineReveal = interpolate(frame, [40, 75], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* radial glow */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          background: `radial-gradient(circle, ${COLORS.glow} 0%, rgba(0,0,0,0) 55%)`,
          opacity: glow * 0.9,
        }}
      />
      <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity, marginBottom: 40 }}>
        <Img src={staticFile("brand/logo.png")} style={{ width: 340, height: "auto" }} />
      </div>
      <div
        style={{
          fontFamily: "Inter",
          fontWeight: 800,
          color: COLORS.ink,
          fontSize: 68,
          lineHeight: 1.05,
          textAlign: "center",
          padding: "0 60px",
          letterSpacing: -1.5,
          overflow: "hidden",
          maxWidth: 900,
        }}
      >
        <div style={{ transform: `translateY(${interpolate(lineReveal, [0, 1], [80, 0])}px)`, opacity: lineReveal }}>
          Your business deserves
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(lineReveal, [0, 1], [80, 0])}px)`,
            opacity: lineReveal,
            color: COLORS.primary,
          }}
        >
          more than social media.
        </div>
      </div>
    </AbsoluteFill>
  );
};
