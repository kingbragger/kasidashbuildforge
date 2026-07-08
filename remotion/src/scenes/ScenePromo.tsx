import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../theme";

export const ScenePromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chipS = spring({ frame: frame - 5, fps, config: { damping: 15 } });
  const priceS = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 90 } });
  const priceScale = interpolate(priceS, [0, 1], [0.6, 1]);
  const oncePop = spring({ frame: frame - 60, fps, config: { damping: 10 } });
  const line2 = spring({ frame: frame - 100, fps, config: { damping: 18 } });
  const hidden = spring({ frame: frame - 160, fps, config: { damping: 18 } });

  // pulsing glow
  const pulse = 0.6 + 0.4 * Math.sin(frame / 8);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #1a0d02 0%, #05070c 60%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.glow} 0%, rgba(0,0,0,0) 60%)`,
          opacity: pulse * 0.9,
        }}
      />
      <div
        style={{
          fontFamily: "Inter",
          color: COLORS.primary,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          border: `2px solid ${COLORS.primary}`,
          padding: "10px 24px",
          borderRadius: 999,
          transform: `scale(${chipS})`,
          opacity: chipS,
          marginBottom: 30,
        }}
      >
        Limited Time Promotion
      </div>

      <div
        style={{
          fontFamily: "Inter",
          color: COLORS.ink,
          fontSize: 44,
          fontWeight: 600,
          opacity: interpolate(priceS, [0, 1], [0, 1]),
          marginBottom: 4,
        }}
      >
        Website from only
      </div>
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 320,
          fontWeight: 900,
          color: COLORS.primary,
          letterSpacing: -12,
          lineHeight: 0.9,
          transform: `scale(${priceScale})`,
          opacity: priceS,
          textShadow: `0 0 60px ${COLORS.glow}`,
        }}
      >
        R500
      </div>
      <div
        style={{
          fontFamily: "Inter",
          color: COLORS.ink,
          fontSize: 46,
          fontWeight: 800,
          letterSpacing: -1,
          transform: `scale(${interpolate(oncePop, [0, 1], [0.5, 1])})`,
          opacity: oncePop,
          marginTop: -10,
          marginBottom: 40,
        }}
      >
        once-off
      </div>

      <div
        style={{
          fontFamily: "Inter",
          color: COLORS.ink,
          fontSize: 38,
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 900,
          transform: `translateY(${interpolate(line2, [0, 1], [30, 0])}px)`,
          opacity: line2,
          lineHeight: 1.2,
        }}
      >
        Then just <span style={{ color: COLORS.accent, fontWeight: 900 }}>R160/month</span> for your
        <br />
        .co.za domain + business email
      </div>

      <div
        style={{
          marginTop: 32,
          fontFamily: "Inter",
          color: COLORS.muted,
          fontSize: 28,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: hidden,
        }}
      >
        No hidden costs · No tech skills needed
      </div>
    </AbsoluteFill>
  );
};
