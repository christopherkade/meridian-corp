"use client";

import { useGameStore } from "@/lib/store";
import { DesktopShell } from "@/components/DesktopShell";
import { MainMenu } from "@/components/MainMenu";
import { GameView } from "@/components/GameView";
import { FeedbackView } from "@/components/FeedbackView";
import { CaseEndView } from "@/components/CaseEndView";
import { DashboardView } from "@/components/DashboardView";

export default function GameClient() {
  const screen = useGameStore((s) => s.screen);

  return (
    <DesktopShell>
      {screen === "menu" && <MainMenu />}
      {screen === "game" && <GameView />}
      {screen === "feedback" && <FeedbackView />}
      {screen === "case-end" && <CaseEndView />}
      {screen === "dashboard" && <DashboardView />}
    </DesktopShell>
  );
}
