"use client";

import { useGameStore } from "@/lib/store";
import { DesktopShell } from "@/components/DesktopShell";
import { MainMenu } from "@/components/MainMenu";
import { DifficultySelect } from "@/components/DifficultySelect";
import { GameView } from "@/components/GameView";
import { FeedbackView } from "@/components/FeedbackView";
import { CaseEndView } from "@/components/CaseEndView";
import { DashboardView } from "@/components/DashboardView";
import { GameOver } from "@/components/GameOver";
import { Watercooler } from "@/components/Watercooler";

export default function GameClient() {
  const screen = useGameStore((s) => s.screen);
  const showWatercooler = useGameStore((s) => s.showWatercooler);
  const dismissWatercooler = useGameStore((s) => s.dismissWatercooler);

  return (
    <DesktopShell>
      {showWatercooler ? (
        <Watercooler onDismiss={dismissWatercooler} />
      ) : (
        <>
          {screen === "menu" && <MainMenu />}
          {screen === "difficulty" && <DifficultySelect />}
          {screen === "game" && <GameView />}
          {screen === "feedback" && <FeedbackView />}
          {screen === "case-end" && <CaseEndView />}
          {screen === "dashboard" && <DashboardView />}
          {screen === "game-over" && <GameOver />}
        </>
      )}
    </DesktopShell>
  );
}
