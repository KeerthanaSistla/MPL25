import { Card } from "@/components/ui/card";
import { Trophy, Target } from "lucide-react";
import { GameState } from "./GameScreen";

interface ScoreboardProps {
  teamAName: string;
  teamBName: string;
  gameState: GameState;
}

export const Scoreboard = ({ teamAName, teamBName, gameState }: ScoreboardProps) => {
  const battingTeamName = gameState.battingTeam === "A" ? teamAName : teamBName;
  const bowlingTeamName = gameState.battingTeam === "A" ? teamBName : teamAName;

  return (
    <Card className="bg-gradient-pitch p-6 shadow-stadium">
      {/* Show result if game over */}
      {gameState.gameOver && (
        <div className="mb-4 p-4 rounded-lg bg-accent/20 text-center">
          <h2 className="text-2xl font-extrabold">Match Result</h2>
          <p className="text-lg mt-2">{gameState.winner === "Tie" ? "It's a Tie!" : `${gameState.winner} won! 🏆`}</p>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Current Score */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-bold text-foreground">Current Innings</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{battingTeamName} (Batting)</p>
          <div className="text-5xl font-bold text-foreground">
            {gameState.runs}/{gameState.wickets}
          </div>
          <p className="text-xl text-muted-foreground mt-1">
            ({gameState.overs}.{gameState.balls % 6} overs)
          </p>
        </div>

        {/* Innings Info */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20">
            <span className="text-sm font-bold text-secondary">INNINGS {gameState.innings}</span>
          </div>
          {gameState.innings === 2 && gameState.teamAScore && (
            <div className="mt-4 p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-secondary" />
                <p className="text-sm font-bold">Target</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {gameState.teamAScore.runs + 1}
              </p>
            </div>
          )}
        </div>

        {/* Match Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Extras</p>
            <p className="text-2xl font-bold text-foreground">{gameState.extras}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Run Rate</p>
            <p className="text-2xl font-bold text-foreground">
              {gameState.overs > 0 ? (gameState.runs / gameState.overs).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* Bowling team info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {bowlingTeamName} (Bowling)
        </p>
      </div>
    </Card>
  );
};
