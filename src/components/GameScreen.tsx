import { useState } from "react";
import { TeamPanel } from "./TeamPanel";
import { GameZone } from "./GameZone";
import { Scoreboard } from "./Scoreboard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QUESTIONS } from "../data/questions";
interface GameScreenProps {
  teamAName: string;
  teamBName: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  battingFirst: "A" | "B";
  onNewGame?: () => void;
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

// Create two distinct 15-question pools so innings 1 and innings 2 use different questions
const generatePools = () => {
  const all = [...QUESTIONS];
  const shuffled = all.sort(() => Math.random() - 0.5);
  const first = shuffled.slice(0, 15).map((q, idx) => ({ ...q, id: idx + 1 }));
  const second = shuffled.slice(15, 30).map((q, idx) => ({ ...q, id: idx + 16 }));

  // Mark 5 random balls in each pool as extras (wide/noball)
  const markExtras = (pool: any[]) => {
    const idxs = Array.from({ length: pool.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, 5);
    for (const i of idxs) {
      pool[i].type = Math.random() < 0.5 ? "wide" : "noball";
      // extras typically award 1 run
      pool[i].runs = 0; // extra doesn't carry runs from question
    }
  };

  markExtras(first);
  markExtras(second);
  return { first, second };
};

const [questionPools] = ((): [{ first: typeof QUESTIONS; second: typeof QUESTIONS }] => {
  // Use a stable initial value so pools don't reshuffle on re-render
  const pools = generatePools();
  return [pools as any];
})();

export const GameScreen = ({ teamAName, teamBName, teamAPlayers, teamBPlayers, battingFirst, onNewGame }: GameScreenProps) => {
  const initialBowlingTeam = battingFirst === "A" ? teamBPlayers : teamAPlayers;
  const initialBowlingSize = Math.max(1, initialBowlingTeam.length);
  const [gameState, setGameState] = useState<GameState>({
    innings: 1,
    battingTeam: battingFirst,
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: 0,
    currentBatter: 0,
    currentBowler: initialBowlingSize - 1, // Start from last player
    usedBalls: [],
    gameOver: false,
  });
  const [modalMessage, setModalMessage] = useState<{ title: string; description: string } | null>(null);
  const [inningsOverModal, setInningsOverModal] = useState<{ title: string; description: string } | null>(null);
  const [winnerModal, setWinnerModal] = useState<{ title: string; description: string } | null>(null);

  const handleBallSelect = (ballNumber: number) => {
    setGameState(prev => ({
      ...prev,
      usedBalls: [...prev.usedBalls, ballNumber],
    }));
  };

  const showModal = (title: string, description: string, persistent: boolean = false) => {
    setModalMessage({ title, description });
    if (!persistent) {
      setTimeout(() => setModalMessage(null), 750); // Auto-dismiss after 1 second
    }
  };

  const handleAnswer = (result: { batterCorrect?: boolean; bowlerCorrect?: boolean; runs?: number; isExtra?: boolean; extraType?: "wide" | "noball"; extraRuns?: number }) => {
    setGameState(prev => {
      // Handle extras first: award extraRuns (default 1), increment extras, but do not count as legal ball
      if (result.isExtra) {
        const added = result.extraRuns ?? 1;
        const newRuns = prev.runs + added;
        const newExtras = prev.extras + added;
        showModal(`EXTRA +${added}`, `Received ${result.extraType}`);
        return { ...prev, runs: newRuns, extras: newExtras };
      }

      const newBalls = prev.balls + 1;
      const newOvers = prev.overs + (newBalls % 6 === 0 ? 1 : 0);
      const ballsInOver = newBalls % 6;

      let newRuns = prev.runs;
      let newWickets = prev.wickets;
      let newBatter = prev.currentBatter;
      let newBowler = prev.currentBowler;

      if (result.batterCorrect) {
        // Batter scored runs
        newRuns += result.runs ?? 0;
        showModal(`${result.runs ?? 0} RUN${(result.runs ?? 0) !== 1 ? "S" : ""}! 🎉`, `Great shot by the batter!`);
      } else if (result.bowlerCorrect) {
        // Wicket!
        newWickets += 1;
        showModal("WICKET! 🎯", "Bowler got it right! Batter is out!");
      } else {
        // Dot ball (both wrong)
        showModal("DOT BALL ⚪", "Both got it wrong!");
      }

  // Determine team sizes based on who's batting currently
  const battingPlayers = prev.battingTeam === "A" ? teamAPlayers : teamBPlayers;
  const bowlingPlayers = prev.battingTeam === "A" ? teamBPlayers : teamAPlayers;
  const battingSize = Math.max(1, battingPlayers.length);
  const bowlingSize = Math.max(1, bowlingPlayers.length);

  // Move to next batter (top to bottom) and wrap around smaller teams
  newBatter = (prev.currentBatter + 1) % battingSize;

  // Move to next bowler (bottom to top) and wrap using bowlingSize
  // Normalize prev.currentBowler to be within [0, bowlingSize-1]
  const normalizedPrevBowler = ((prev.currentBowler % bowlingSize) + bowlingSize) % bowlingSize;
  newBowler = (normalizedPrevBowler - 1 + bowlingSize) % bowlingSize;

      // Check innings boundaries: 10 balls per innings
      const BALLS_PER_INNINGS = 10;

      // If currently in innings 1 and we've completed the allotted balls, end innings 1
      if (prev.innings === 1 && newBalls >= BALLS_PER_INNINGS) {
        // Save team A score (score of first innings regardless of which team batted first)
        const teamAScore = prev.battingTeam === "A" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : prev.teamAScore ?? { runs: 0, wickets: 0, overs: 0 };
        const teamBScore = prev.battingTeam === "B" ? { runs: newRuns, wickets: newWickets, overs: newOvers } : undefined;

        // Determine new batting team (switch)
        const nextBatting = prev.battingTeam === "A" ? "B" : "A";

        setInningsOverModal({ title: "Innings Over", description: `Score: ${newRuns}/${newWickets} in ${newOvers}.${newBalls % 6} overs. Target: ${newRuns + 1} runs.` });

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
          extras: 0,
          currentBatter: 0,
          currentBowler: Math.max(1, (prev.battingTeam === "A" ? teamAPlayers : teamBPlayers).length) - 1,
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
          setWinnerModal({ title: "🏆 Match Winner!", description: `${winnerName} won by chasing the target!` });
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

          setWinnerModal({ title: "🏆 Match Winner!", description: winnerName === "Tie" ? `The match is a tie.` : `${winnerName} won the match!` });

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
      <div className="flex justify-end mb-2">
        <button
          className="px-3 py-1 rounded bg-muted hover:bg-accent"
          onClick={() => {
            if (onNewGame) return onNewGame();
            if (window.confirm("Start a new game? This will reset teams and questions.")) {
              window.location.reload();
            }
          }}
        >
          New Game
        </button>
      </div>
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
          currentPlayer={battingTeamPlayers.length > 0 ? gameState.currentBatter % battingTeamPlayers.length : 0}
          role="batting"
        />

        {/* Center: Game Zone */}
        <GameZone
          availableBalls={((): (typeof QUESTIONS[number] | null)[] => {
            const pool = gameState.innings === 1 ? questionPools.first : questionPools.second;
            // create 15 slots; if a question from pool is used, slot becomes null
            return pool.map(q => (gameState.usedBalls.includes(q.id) ? null : q));
          })()}
          onBallSelect={handleBallSelect}
          onAnswer={handleAnswer}
          innings={gameState.innings}
        />

        {/* Right: Bowling Team */}
        <TeamPanel
          teamName={gameState.battingTeam === "A" ? teamBName : teamAName}
          players={bowlingTeamPlayers}
          color={gameState.battingTeam === "A" ? "team-b" : "team-a"}
          currentPlayer={bowlingTeamPlayers.length > 0 ? gameState.currentBowler % bowlingTeamPlayers.length : 0}
          role="bowling"
        />
      </div>

      {/* Modal for game events */}
      {modalMessage && (
        <Dialog open={!!modalMessage} onOpenChange={() => setModalMessage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modalMessage.title}</DialogTitle>
              <DialogDescription>{modalMessage.description}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal for innings over */}
      {inningsOverModal && (
        <Dialog open={!!inningsOverModal} onOpenChange={() => setInningsOverModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{inningsOverModal.title}</DialogTitle>
              <DialogDescription>{inningsOverModal.description}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal for match winner */}
      {winnerModal && (
        <Dialog open={!!winnerModal} onOpenChange={() => setWinnerModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">{winnerModal.title}</DialogTitle>
              <DialogDescription className="text-lg text-center mt-4">{winnerModal.description}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
