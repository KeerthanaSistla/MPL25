import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface TossScreenProps {
  teamAName: string;
  teamBName: string;
  onComplete: (winner: "A" | "B", choice: "bat" | "bowl") => void;
}

export const TossScreen = ({ teamAName, teamBName, onComplete }: TossScreenProps) => {
  const [stage, setStage] = useState<"choose" | "flipping" | "result">("choose");
  const [choice, setChoice] = useState<"heads" | "tails" | null>(null);
  const [winner, setWinner] = useState<"A" | "B" | null>(null);

  const handleToss = (selectedChoice: "heads" | "tails") => {
    setChoice(selectedChoice);
    setStage("flipping");

    setTimeout(() => {
      const result = Math.random() > 0.5 ? "heads" : "tails";
      const tossWinner = result === selectedChoice ? "A" : "B";
      setWinner(tossWinner);
      setStage("result");
    }, 2000);
  };

  const handleBatBowl = (decision: "bat" | "bowl") => {
    if (winner) {
      onComplete(winner, decision);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-stadium flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-12 bg-card shadow-stadium text-center animate-fade-in-scale">
        {stage === "choose" && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-secondary mb-2">Time for the Toss!</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {teamAName} - Choose Heads or Tails
            </p>
            <div className="flex justify-center gap-6">
              <Button
                onClick={() => handleToss("heads")}
                size="lg"
                className="bg-gradient-team-a hover:scale-105 transition-transform text-xl px-12 py-8"
              >
                <Coins className="w-6 h-6 mr-2" />
                Heads
              </Button>
              <Button
                onClick={() => handleToss("tails")}
                size="lg"
                className="bg-gradient-team-b hover:scale-105 transition-transform text-xl px-12 py-8"
              >
                <Coins className="w-6 h-6 mr-2" />
                Tails
              </Button>
            </div>
          </div>
        )}

        {stage === "flipping" && (
          <div className="space-y-8">
            <div className="animate-coin-flip">
              <Coins className="w-32 h-32 mx-auto text-secondary" />
            </div>
            <p className="text-2xl text-muted-foreground">Flipping the coin...</p>
          </div>
        )}

        {stage === "result" && winner && (
          <div className="space-y-8 animate-bounce-in">
            <h2 className="text-4xl font-bold mb-4">
              <span className={winner === "A" ? "text-team-a" : "text-team-b"}>
                {winner === "A" ? teamAName : teamBName}
              </span>
              {" "}wins the toss!
            </h2>
            <p className="text-xl text-muted-foreground mb-8">Choose to bat or bowl first</p>
            <div className="flex justify-center gap-6">
              <Button
                onClick={() => handleBatBowl("bat")}
                size="lg"
                className="bg-gradient-pitch hover:scale-105 transition-transform text-xl px-12 py-8"
              >
                Bat First
              </Button>
              <Button
                onClick={() => handleBatBowl("bowl")}
                size="lg"
                className="bg-gradient-pitch hover:scale-105 transition-transform text-xl px-12 py-8"
              >
                Bowl First
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
