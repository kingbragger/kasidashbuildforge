import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { COLORS } from "../theme";

export const SceneWebsiteReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = spring({ frame: frame - 15, fps, config: { damping: 15 } });
  const title = spring({ frame: frame - 30, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <KenBurns src="shots/d00.png" from={[1.15, -5, -3]} to={[1.35, 5, 5]} />
      {/* dark gradient for text legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 60px 160px",
        }}
      >
        <div
          style={{
            fontFamily: "Inter",
            color: COLORS.primary,
            border: `2px solid ${COLORS.primary}`,
            borderRadius: 999,
            padding: "10px 22px",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 24,
            transform: `translateY(${interpolate(chip, [0, 1], [40, 0])}px)`,
            opacity: chip,
          }}
        >
          Kasidash · Web Design
        </div>
        <div
          style={{
            fontFamily: "Inter",
            color: COLORS.ink,
            fontSize: 90,
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: -3,
            maxWidth: 900,
            transform: `translateY(${interpolate(title, [0, 1], [60, 0])}px)`,
            opacity: title,
          }}
        >
          Websites that <span style={{ color: COLORS.primary }}>win</span> customers.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
