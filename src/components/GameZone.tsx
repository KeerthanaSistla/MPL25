import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, Clock } from "lucide-react";

interface Question {
  id: number;
  text: string;
  choices: string[];
  correctIndex: number;
  runs: number;
}

interface GameZoneProps {
  availableBalls: (Question | null)[];
  onBallSelect: (ballNumber: number) => void;
  onAnswer: (result: { batterCorrect: boolean; bowlerCorrect?: boolean; runs: number }) => void;
}

export const GameZone = ({ availableBalls, onBallSelect, onAnswer }: GameZoneProps) => {
  const [selectedBall, setSelectedBall] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [stage, setStage] = useState<"batter" | "bowler" | null>(null);
  const [batterAnswer, setBatterAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (selectedBall && stage && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - treat as wrong answer
            if (stage === "batter") {
              handleBatterWrong();
            } else {
              handleBowlerAnswer(false);
            }
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedBall, stage, timeLeft]);

  const handleBallClick = (ball: Question) => {
    setSelectedBall(ball);
    setStage("batter");
    setTimeLeft(30);
    setBatterAnswer(null);
    onBallSelect(ball.id);
  };

  const handleBatterWrong = () => {
    setStage("bowler");
    setTimeLeft(30);
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (!selectedBall) return;

    const isCorrect = optionIndex === selectedBall.correctIndex;

    if (stage === "batter") {
      if (isCorrect) {
        // Batter scored runs
        onAnswer({ batterCorrect: true, runs: selectedBall.runs });
        resetGame();
      } else {
        // Batter got it wrong, bowler's turn
        setBatterAnswer(optionIndex);
        handleBatterWrong();
      }
    } else if (stage === "bowler") {
      handleBowlerAnswer(isCorrect);
    }
  };

  const handleBowlerAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Bowler correct = Wicket
      onAnswer({ batterCorrect: false, bowlerCorrect: true, runs: 0 });
    } else {
      // Both wrong = Dot ball
      onAnswer({ batterCorrect: false, bowlerCorrect: false, runs: 0 });
    }
    resetGame();
  };

  const resetGame = () => {
    setSelectedBall(null);
    setStage(null);
    setTimeLeft(30);
    setBatterAnswer(null);
  };

  return (
    <div className="space-y-4">
      {/* Ball Selection Grid */}
      <Card className="bg-card/80 backdrop-blur-sm p-6 shadow-pitch">
        <h3 className="text-xl font-bold text-center mb-4 text-secondary">Select a Ball</h3>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 15 }, (_, i) => {
            const ball = availableBalls[i];
            const isAvailable = ball !== null;
            return (
              <Button
                key={i + 1}
                onClick={() => {
                  if (ball) handleBallClick(ball);
                }}
                disabled={!isAvailable}
                className={`aspect-square text-lg font-bold ${
                  isAvailable
                    ? "bg-gradient-pitch hover:scale-110 hover:shadow-glow animate-pulse-glow"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {i + 1}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Question Display */}
      {selectedBall ? (
        <Card className="bg-card/80 backdrop-blur-sm p-8 shadow-stadium animate-bounce-in">
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-gold mb-4">
                <Circle className="w-4 h-4" />
                <span className="font-bold">Ball {selectedBall.id}</span>
                <Circle className="w-4 h-4" />
              </div>
              
              {/* Timer */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <span className={`text-2xl font-bold ${timeLeft <= 10 ? "text-destructive animate-pulse" : ""}`}>
                  {timeLeft}s
                </span>
              </div>

              {/* Stage indicator */}
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {stage === "batter" ? "🏏 Batter's Turn" : "⚾ Bowler's Turn"}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                {selectedBall.text}
              </h3>
              <p className="text-sm text-muted-foreground">
                Worth {selectedBall.runs} run{selectedBall.runs !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedBall.choices.map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleAnswerClick(idx)}
                  size="lg"
                  disabled={stage === "bowler" && batterAnswer === idx}
                  className={`h-20 text-lg bg-muted hover:bg-accent hover:scale-105 transition-transform ${
                    stage === "bowler" && batterAnswer === idx ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {option}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-card/80 backdrop-blur-sm p-12 shadow-stadium">
          <p className="text-center text-xl text-muted-foreground">
            Select a ball number to see the question
          </p>
        </Card>
      )}
    </div>
  );
};
