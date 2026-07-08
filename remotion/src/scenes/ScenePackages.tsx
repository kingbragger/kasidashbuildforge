import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { COLORS } from "../theme";

export const ScenePackages: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badges = ["Business Websites", "E-Commerce", "Booking Platforms", "Portfolios", "Landing Pages"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <KenBurns src="shots/d02.png" from={[1.2, 5, 0]} to={[1.4, -5, -5]} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <AbsoluteFill style={{ padding: "120px 60px", flexDirection: "column", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: "Inter",
            color: COLORS.ink,
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: -2.5,
            lineHeight: 1,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp" })}px)`,
          }}
        >
          Packages for <br />
          <span style={{ color: COLORS.primary }}>every business.</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {badges.map((b, i) => {
            const s = spring({ frame: frame - 40 - i * 10, fps, config: { damping: 16 } });
            return (
              <div
                key={b}
                style={{
                  fontFamily: "Inter",
                  fontSize: 30,
                  fontWeight: 600,
                  color: COLORS.ink,
                  border: `1.5px solid rgba(255,255,255,0.25)`,
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: undefined,
                  padding: "14px 26px",
                  borderRadius: 999,
                  transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                  opacity: s,
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
