import { useState } from "react";
import { TeamPanel } from "./TeamPanel";
import { GameZone } from "./GameZone";
import { Scoreboard } from "./Scoreboard";
import { useToast } from "@/hooks/use-toast";

interface GameScreenProps {
  teamAName: string;
  teamBName: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  battingFirst: "A" | "B";
}

export interface GameState {
  innings: 1 | 2;
  battingTeam: "A" | "B";
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: number;
  currentBatter: number;
  currentBowler: number;
  usedBalls: number[];
  teamAScore?: { runs: number; wickets: number; overs: number };
}

// Mock questions for demonstration
const mockQuestions = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  question: `What is ${Math.floor(Math.random() * 10) + 1} × ${Math.floor(Math.random() * 10) + 1}?`,
  options: ["12", "15", "18", "21"],
  correct: 0,
  runs: [0, 1, 1, 2, 2, 4, 4, 6][Math.floor(Math.random() * 8)],
}));

export const GameScreen = ({ teamAName, teamBName, teamAPlayers, teamBPlayers, battingFirst }: GameScreenProps) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    innings: 1,
    battingTeam: battingFirst,
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: 0,
    currentBatter: 0,
    currentBowler: 0,
    usedBalls: [],
  });

  const handleBallSelect = (ballNumber: number) => {
    setGameState(prev => ({
      ...prev,
      usedBalls: [...prev.usedBalls, ballNumber],
    }));
  };

  const handleAnswer = (result: { batterCorrect: boolean; bowlerCorrect?: boolean; runs: number }) => {
    setGameState(prev => {
      const newBalls = prev.balls + 1;
      const newOvers = prev.overs + (newBalls % 6 === 0 ? 1 : 0);
      const ballsInOver = newBalls % 6;

      let newRuns = prev.runs;
      let newWickets = prev.wickets;
      let newBatter = prev.currentBatter;

      if (result.batterCorrect) {
        // Batter scored runs
        newRuns += result.runs;
        toast({
          title: `${result.runs} RUN${result.runs !== 1 ? "S" : ""}! 🎉`,
          description: `Great shot by the batter!`,
        });
      } else if (result.bowlerCorrect) {
        // Wicket!
        newWickets += 1;
        newBatter = prev.currentBatter + 1;
        toast({
          title: "WICKET! 🎯",
          description: "Bowler got it right! Batter is out!",
          variant: "destructive",
        });
      } else {
        // Dot ball (both wrong)
        toast({
          title: "DOT BALL ⚪",
          description: "Both got it wrong!",
        });
      }

      return {
        ...prev,
        runs: newRuns,
        wickets: newWickets,
        balls: newBalls,
        overs: newOvers,
        currentBatter: newBatter,
      };
    });
  };

  const battingTeamPlayers = gameState.battingTeam === "A" ? teamAPlayers : teamBPlayers;
  const bowlingTeamPlayers = gameState.battingTeam === "A" ? teamBPlayers : teamAPlayers;

  return (
    <div className="min-h-screen bg-gradient-stadium p-4 animate-fade-in">
      <Scoreboard
        teamAName={teamAName}
        teamBName={teamBName}
        gameState={gameState}
      />

      <div className="grid lg:grid-cols-[300px_1fr_300px] gap-4 mt-4">
        {/* Left: Batting Team */}
        <TeamPanel
          teamName={gameState.battingTeam === "A" ? teamAName : teamBName}
          players={battingTeamPlayers}
          color={gameState.battingTeam === "A" ? "team-a" : "team-b"}
          currentPlayer={gameState.currentBatter}
          role="batting"
        />

        {/* Center: Game Zone */}
        <GameZone
          availableBalls={mockQuestions.filter(q => !gameState.usedBalls.includes(q.id))}
          onBallSelect={handleBallSelect}
          onAnswer={handleAnswer}
        />

        {/* Right: Bowling Team */}
        <TeamPanel
          teamName={gameState.battingTeam === "A" ? teamBName : teamAName}
          players={bowlingTeamPlayers}
          color={gameState.battingTeam === "A" ? "team-b" : "team-a"}
          currentPlayer={gameState.currentBowler}
          role="bowling"
        />
      </div>
    </div>
  );
};
