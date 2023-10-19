import { z } from "zod";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { CompositionProps } from "../../types/constants";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React, { useCallback, useEffect, useState } from "react";
import { GitHubResponse } from "./types";
import { Tile } from "./Tile";

const dayDuration = 0.2;

loadFont();

const container: React.CSSProperties = {
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

export const Main = ({ username }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const [data, setData] = useState<GitHubResponse | null>(null);
  const [handle] = useState(() => delayRender());

  const fetchData = useCallback(
    async (name: string) => {
      const res = await fetch(
        `https://contribution-graph-red.vercel.app/api/github?username=${name}`
      );
      const json = await res.json();
      setData(json);
      continueRender(handle);
    },
    [handle]
  );

  useEffect(() => {
    fetchData(username);
  }, [fetchData, username]);

  if (!data || !data.data.user) {
    return null;
  }

  const flatContributions =
    data.data.user.contributionsCollection.contributionCalendar.weeks
      .map((w) => w.contributionDays.map((d) => d.contributionCount))
      .flat(1);

  const highestAmountOfContributionsInADay = Math.max(...flatContributions);

  const usernameOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const contributionsOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontFamily,
          fontSize: 50,
          fontWeight: "bold",
          opacity: usernameOpacity,
        }}
      >
        {username}
      </div>
      <div style={{ fontFamily, fontSize: 40, opacity: contributionsOpacity }}>
        {flatContributions.reduce((a, b) => a + b, 0)} contributions
      </div>
      <div style={{ height: 40 }}></div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {data.data.user.contributionsCollection.contributionCalendar.weeks.map(
          (w, week) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
                key={w.contributionDays[0].date}
              >
                {w.contributionDays.map((day, i) => {
                  return (
                    <Tile
                      amountOfGreen={
                        day.contributionCount /
                        highestAmountOfContributionsInADay
                      }
                      delay={60 + (week * 7 + i) * dayDuration}
                      key={day.date}
                    ></Tile>
                  );
                })}
              </div>
            );
          }
        )}
      </div>
    </AbsoluteFill>
  );
};
