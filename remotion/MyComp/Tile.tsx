import React from "react";
import {
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const SUPERGREEN = "#386C3E";
const SLIGHLTY_GREEN = "#ACE7AE";
const GRAY = "#EBEDF0";

export const Tile: React.FC<{
  amountOfGreen: number;
  delay: number;
}> = ({ amountOfGreen, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    delay,
    config: {
      mass: 2.5,
    },
    durationInFrames: 30,
  });

  return (
    <div
      style={{
        height: 18,
        width: 18,
        backgroundColor:
          amountOfGreen === 0
            ? GRAY
            : interpolateColors(
                amountOfGreen,
                [0, 1],
                [SLIGHLTY_GREEN, SUPERGREEN]
              ),
        borderRadius: 4,
        margin: 2,
        display: "inline-block",
        border: "2px solid rgba(0, 0, 0, 0.05)",
        scale: String(spr),
      }}
    ></div>
  );
};
