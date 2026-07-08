import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { COLORS } from "../theme";

const FEATURES = [
  "Mobile Friendly",
  "Fast Loading",
  "SEO Ready",
  "Business Email Included",
  ".co.za Domain Included",
  "Professional Support",
];

export const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0a0d13 0%, #05070c 60%, #0f0a05 100%)`,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          fontFamily: "Inter",
          color: COLORS.muted,
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 20,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Built for Growth
      </div>
      <div
        style={{
          fontFamily: "Inter",
          color: COLORS.ink,
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: -2,
          marginBottom: 40,
          textAlign: "center",
          opacity: interpolate(frame, [5, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [5, 30], [40, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        Everything included.
      </div>

      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <PhoneFrame
          shots={["shots/v00.png", "shots/v01.png", "shots/v02.png", "shots/v03.png", "shots/v04.png"]}
          width={460}
          scrollDuration={40}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {FEATURES.map((f, i) => {
            const s = spring({ frame: frame - 40 - i * 8, fps, config: { damping: 18 } });
            return (
              <div
                key={f}
                style={{
                  transform: `translateX(${interpolate(s, [0, 1], [80, 0])}px)`,
                  opacity: s,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: COLORS.primary,
                    boxShadow: `0 0 20px ${COLORS.glow}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: "Inter",
                    color: COLORS.ink,
                    fontSize: 36,
                    fontWeight: 600,
                  }}
                >
                  {f}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
