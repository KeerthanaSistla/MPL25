import { useState } from "react";
import { TeamPanel } from "./TeamPanel";
import { GameZone } from "./GameZone";
import { Scoreboard } from "./Scoreboard";
import { useToast } from "@/hooks/use-toast";
import { QUESTIONS } from "@/data/questions";

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
  gameOver?: boolean;
  winner?: string;
}

// Use QUESTIONS from data
const mockQuestions = QUESTIONS.slice(0, 15);

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
    currentBowler: 10, // Start from bottom (last player)
    usedBalls: [],
    gameOver: false,
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
      let newBowler = prev.currentBowler;

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

      // Move to next batter (top to bottom)
      newBatter = prev.currentBatter + 1;
      
      // Move to next bowler (bottom to top)
      newBowler = prev.currentBowler - 1;
      if (newBowler < 0) newBowler = 10; // Wrap around to bottom

      // Check innings boundaries: 10 balls per innings
      const BALLS_PER_INNINGS = 10;

      // If currently in innings 1 and we've completed the allotted balls, end innings 1
      if (prev.innings === 1 && newBalls >= BALLS_PER_INNINGS) {
        // Save team A score (score of first innings regardless of which team batted first)
        const teamAScore = prev.battingTeam === "A" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : prev.teamAScore ?? { runs: 0, wickets: 0, overs: 0 };
        const teamBScore = prev.battingTeam === "B" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : undefined;

        // Determine new batting team (switch)
        const nextBatting = prev.battingTeam === "A" ? "B" : "A";

        toast({ title: "Innings Over", description: `End of innings 1. Target: ${newRuns + 1} runs.` });

        return {
          ...prev,
          // store the first innings score in teamAScore regardless (for target display logic)
          teamAScore: prev.battingTeam === "A" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : prev.teamAScore ?? { runs: newRuns, wickets: newWickets, overs: newOvers },
          innings: 2,
          battingTeam: nextBatting,
          // reset match-specific counters for the chase
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          currentBatter: 0,
          currentBowler: 10,
          // reset usedBalls so all 15 questions are available again for innings 2
          usedBalls: [],
        };
      }

      // If we're in innings 2, check for early victory or end of match after BALLS_PER_INNINGS
      if (prev.innings === 2) {
        const target = prev.teamAScore ? prev.teamAScore.runs + 1 : undefined;

        // Early chase success
        if (typeof target === "number" && newRuns >= target) {
          const winnerName = prev.battingTeam === "A" ? teamAName : teamBName;
          toast({ title: `Match Over`, description: `${winnerName} won by chasing the target! 🏆` });
          return {
            ...prev,
            runs: newRuns,
            wickets: newWickets,
            overs: newOvers,
            balls: newBalls,
            currentBatter: newBatter,
            currentBowler: newBowler,
            gameOver: true,
            winner: winnerName,
          };
        }

        // End of second innings by balls exhausted
        if (newBalls >= BALLS_PER_INNINGS) {
          // Compare scores and declare winner or tie
          const firstInningsRuns = prev.teamAScore ? prev.teamAScore.runs : 0;
          const secondInningsRuns = newRuns;
          let winnerName = "";
          if (secondInningsRuns > firstInningsRuns) {
            winnerName = prev.battingTeam === "A" ? teamAName : teamBName;
          } else if (secondInningsRuns < firstInningsRuns) {
            // Winner is the team that batted first
            winnerName = prev.battingTeam === "A" ? teamBName : teamAName;
          } else {
            winnerName = "Tie";
          }

          toast({ title: `Match Over`, description: winnerName === "Tie" ? `The match is a tie.` : `${winnerName} won the match! 🏆` });

          return {
            ...prev,
            runs: newRuns,
            wickets: newWickets,
            overs: newOvers,
            balls: newBalls,
            currentBatter: newBatter,
            currentBowler: newBowler,
            gameOver: true,
            winner: winnerName,
          };
        }
      }

      return {
        ...prev,
        runs: newRuns,
        wickets: newWickets,
        balls: newBalls,
        overs: newOvers,
        currentBatter: newBatter,
        currentBowler: newBowler,
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
