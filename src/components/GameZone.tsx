import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  runs: number;
}

interface GameZoneProps {
  availableBalls: Question[];
  onBallSelect: (ballNumber: number) => void;
  onAnswer: (isCorrect: boolean) => void;
}

export const GameZone = ({ availableBalls, onBallSelect, onAnswer }: GameZoneProps) => {
  const [selectedBall, setSelectedBall] = useState<Question | null>(null);

  const handleBallClick = (ball: Question) => {
    setSelectedBall(ball);
    onBallSelect(ball.id);
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (selectedBall) {
      const isCorrect = optionIndex === selectedBall.correct;
      onAnswer(isCorrect);
      setSelectedBall(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Ball Selection Grid */}
      <Card className="bg-card/80 backdrop-blur-sm p-6 shadow-pitch">
        <h3 className="text-xl font-bold text-center mb-4 text-secondary">Select a Ball</h3>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 15 }, (_, i) => {
            const isAvailable = availableBalls.some(b => b.id === i + 1);
            return (
              <Button
                key={i + 1}
                onClick={() => {
                  const ball = availableBalls.find(b => b.id === i + 1);
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
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {selectedBall.question}
              </h3>
              <p className="text-sm text-muted-foreground">
                Worth {selectedBall.runs} run{selectedBall.runs !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedBall.options.map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleAnswerClick(idx)}
                  size="lg"
                  className="h-20 text-lg bg-muted hover:bg-accent hover:scale-105 transition-transform"
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
