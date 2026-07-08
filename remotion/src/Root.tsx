import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="vertical"
        component={MainVideo}
        durationInFrames={1350}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ orientation: "vertical" as const }}
      />
      <Composition
        id="landscape"
        component={MainVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ orientation: "landscape" as const }}
      />
    </>
  );
};
