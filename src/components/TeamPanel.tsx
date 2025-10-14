import { Card } from "@/components/ui/card";
import { User, Star } from "lucide-react";

interface TeamPanelProps {
  teamName: string;
  players: string[];
  color: "team-a" | "team-b";
  currentPlayer: number;
  role: "batting" | "bowling";
}

export const TeamPanel = ({ teamName, players, color, currentPlayer, role }: TeamPanelProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm p-4 shadow-stadium animate-fade-in-scale">
      <div className={`p-3 rounded-t-lg mb-4 bg-gradient-${color}`}>
        <h2 className="text-xl font-bold text-center text-foreground">{teamName}</h2>
        <p className="text-center text-sm text-muted-foreground capitalize">{role}</p>
      </div>

      <div className="space-y-2">
        {players.map((player, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border transition-all ${
              idx === currentPlayer
                ? `border-${color} bg-${color}/10 shadow-glow`
                : "border-border bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {idx === currentPlayer ? (
                <Star className={`w-4 h-4 text-${color} animate-pulse-glow`} />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={`text-sm font-medium ${idx === currentPlayer ? "text-foreground" : "text-muted-foreground"}`}>
                {idx + 1}. {player}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
