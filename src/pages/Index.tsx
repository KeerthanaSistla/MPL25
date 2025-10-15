import { useState } from "react";
import { SetupScreen } from "@/components/SetupScreen";
import { TossScreen } from "@/components/TossScreen";
import { GameScreen } from "@/components/GameScreen";

type Screen = "setup" | "toss" | "game";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("setup");
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>([]);
  const [battingFirst, setBattingFirst] = useState<"A" | "B">("A");

  const handleSetupComplete = (
    tAName: string,
    tBName: string,
    tAPlayers: string[],
    tBPlayers: string[]
  ) => {
    setTeamAName(tAName);
    setTeamBName(tBName);
    setTeamAPlayers(tAPlayers);
    setTeamBPlayers(tBPlayers);
    setScreen("toss");
  };

  const handleTossComplete = (winner: "A" | "B", choice: "bat" | "bowl") => {
    setBattingFirst(choice === "bat" ? winner : winner === "A" ? "B" : "A");
    setScreen("game");
  };

  const handleNewGame = () => {
    // Clear teams and go back to setup
    setTeamAName("");
    setTeamBName("");
    setTeamAPlayers([]);
    setTeamBPlayers([]);
    setBattingFirst("A");
    setScreen("setup");
  };

  return (
    <>
      {screen === "setup" && <SetupScreen onComplete={handleSetupComplete} />}
      {screen === "toss" && (
        <TossScreen
          teamAName={teamAName}
          teamBName={teamBName}
          onComplete={handleTossComplete}
        />
      )}
      {screen === "game" && (
        <GameScreen
          teamAName={teamAName}
          teamBName={teamBName}
          teamAPlayers={teamAPlayers}
          teamBPlayers={teamBPlayers}
          battingFirst={battingFirst}
          onNewGame={handleNewGame}
        />
      )}
    </>
  );
};

export default Index;
