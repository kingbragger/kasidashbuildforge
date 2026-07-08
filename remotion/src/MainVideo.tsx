import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Inter";
import { COLORS } from "./theme";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneWebsiteReveal } from "./scenes/SceneWebsiteReveal";
import { SceneFeatures } from "./scenes/SceneFeatures";
import { ScenePackages } from "./scenes/ScenePackages";
import { ScenePromo } from "./scenes/ScenePromo";
import { SceneClosing } from "./scenes/SceneClosing";

loadDisplay("normal", { weights: ["400", "600", "800", "900"], subsets: ["latin"] });

// Scene schedule (30fps)
// 0-120   Intro (4s)                black -> logo -> tagline
// 120-330 Website reveal (7s)       hero screenshot ken-burns
// 330-540 Features (7s)             animated text stack + phone
// 540-780 Packages (8s)             pricing overlays
// 780-1050 Promo (9s)               R500 headline + R160 line
// 1050-1350 Closing (10s)           contact + CTA fade

const scenes: { from: number; dur: number; C: React.FC }[] = [
  { from: 0, dur: 120, C: SceneIntro },
  { from: 120, dur: 210, C: SceneWebsiteReveal },
  { from: 330, dur: 210, C: SceneFeatures },
  { from: 540, dur: 240, C: ScenePackages },
  { from: 780, dur: 270, C: ScenePromo },
  { from: 1050, dur: 300, C: SceneClosing },
];

export const MainVideo: React.FC<{ orientation: "vertical" | "landscape" }> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Global film grain / vignette
  const vignette = 0.55;
  // subtle fade in/out overall
  const globalOpacity = interpolate(
    frame,
    [0, 15, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: globalOpacity }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <s.C />
        </Sequence>
      ))}
      {/* Vignette overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
          opacity: vignette,
        }}
      />
    </AbsoluteFill>
  );
};
