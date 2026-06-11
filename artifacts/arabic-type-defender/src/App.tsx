import { useState, useCallback } from "react";
import { GameState, Difficulty } from "./game/types";
import MenuScreen from "./screens/MenuScreen";
import GameScreen from "./screens/GameScreen";
import GameOverScreen from "./screens/GameOverScreen";
import InstructionsScreen from "./screens/InstructionsScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";

type AppScreen = "menu" | "game" | "gameover" | "instructions" | "leaderboard";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [lastGameState, setLastGameState] = useState<GameState | null>(null);

  const handleStart = useCallback((d: Difficulty) => {
    setDifficulty(d);
    setScreen("game");
  }, []);

  const handleGameOver = useCallback((state: GameState) => {
    setLastGameState(state);
    setScreen("gameover");
  }, []);

  const handleRestart = useCallback(() => {
    setScreen("game");
  }, []);

  const handleMenu = useCallback(() => {
    setScreen("menu");
  }, []);

  if (screen === "menu") {
    return (
      <MenuScreen
        onStart={handleStart}
        onInstructions={() => setScreen("instructions")}
        onLeaderboard={() => setScreen("leaderboard")}
      />
    );
  }

  if (screen === "game") {
    return (
      <GameScreen
        difficulty={difficulty}
        onGameOver={handleGameOver}
        onMenu={handleMenu}
      />
    );
  }

  if (screen === "gameover" && lastGameState) {
    return (
      <GameOverScreen
        gameState={lastGameState}
        onRestart={handleRestart}
        onMenu={handleMenu}
      />
    );
  }

  if (screen === "instructions") {
    return <InstructionsScreen onBack={handleMenu} />;
  }

  if (screen === "leaderboard") {
    return <LeaderboardScreen onBack={handleMenu} />;
  }

  return null;
}
