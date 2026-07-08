import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../theme";

export const SceneClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const logoS = spring({ frame: frame - 10, fps, config: { damping: 18 } });
  const web = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const wa = spring({ frame: frame - 85, fps, config: { damping: 18 } });
  const tag = spring({ frame: frame - 140, fps, config: { damping: 20 } });
  const finalFade = interpolate(frame, [durationInFrames - 40, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity: finalFade,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.glow} 0%, rgba(0,0,0,0) 60%)`,
          opacity: 0.6,
        }}
      />
      <div style={{ transform: `scale(${interpolate(logoS, [0, 1], [0.6, 1])})`, opacity: logoS, marginBottom: 40 }}>
        <Img src={staticFile("brand/logo.png")} style={{ width: 360, height: "auto" }} />
      </div>

      <div
        style={{
          fontFamily: "Inter",
          color: COLORS.ink,
          fontSize: 56,
          fontWeight: 900,
          letterSpacing: -1.5,
          transform: `translateY(${interpolate(web, [0, 1], [30, 0])}px)`,
          opacity: web,
        }}
      >
        kasidash.co.za
      </div>

      <div
        style={{
          marginTop: 28,
          padding: "18px 34px",
          borderRadius: 999,
          background: "#25D366",
          fontFamily: "Inter",
          fontSize: 34,
          fontWeight: 800,
          color: "#03210f",
          transform: `scale(${interpolate(wa, [0, 1], [0.7, 1])})`,
          opacity: wa,
          boxShadow: "0 20px 60px rgba(37,211,102,0.4)",
        }}
      >
        WhatsApp · Message Us Today
      </div>

      <div
        style={{
          marginTop: 80,
          fontFamily: "Inter",
          color: COLORS.ink,
          fontSize: 34,
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.35,
          opacity: tag,
          transform: `translateY(${interpolate(tag, [0, 1], [20, 0])}px)`,
        }}
      >
        Professional Websites · Affordable Pricing · Real Results
      </div>

      <div
        style={{
          marginTop: 22,
          fontFamily: "Inter",
          color: COLORS.primary,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: tag,
        }}
      >
        Building Businesses for Tomorrow
      </div>
    </AbsoluteFill>
  );
};
