import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface SetupScreenProps {
  onComplete: (teamAName: string, teamBName: string, teamAPlayers: string[], teamBPlayers: string[]) => void;
}

export const SetupScreen = ({ onComplete }: SetupScreenProps) => {
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>(Array(11).fill(""));
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>(Array(11).fill(""));

  const handleSubmit = () => {
    const validTeamA = teamAPlayers.filter(p => p.trim() !== "");
    const validTeamB = teamBPlayers.filter(p => p.trim() !== "");
    
    if (validTeamA.length === 11 && validTeamB.length === 11) {
      onComplete(teamAName, teamBName, validTeamA, validTeamB);
    }
  };

  const isValid = teamAPlayers.every(p => p.trim() !== "") && teamBPlayers.every(p => p.trim() !== "");

  return (
    <div className="min-h-screen bg-gradient-stadium flex items-center justify-center p-6 animate-fade-in">
      <Card className="w-full max-w-6xl p-8 bg-card shadow-stadium">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="w-10 h-10 text-secondary" />
          <h1 className="text-4xl font-bold text-center bg-gradient-gold bg-clip-text text-transparent">
            Mathematics Premier League
          </h1>
          <Trophy className="w-10 h-10 text-secondary" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Team A */}
          <div className="space-y-4 animate-slide-in-left">
            <div className="p-4 rounded-lg bg-gradient-team-a">
              <Input
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="text-2xl font-bold text-center bg-card/50 border-team-a"
                placeholder="Team A Name"
              />
            </div>
            <div className="space-y-2">
              {teamAPlayers.map((player, idx) => (
                <Input
                  key={`team-a-${idx}`}
                  value={player}
                  onChange={(e) => {
                    const newPlayers = [...teamAPlayers];
                    newPlayers[idx] = e.target.value;
                    setTeamAPlayers(newPlayers);
                  }}
                  placeholder={`Player ${idx + 1}`}
                  className="bg-muted border-team-a/30 focus:border-team-a"
                />
              ))}
            </div>
          </div>

          {/* Team B */}
          <div className="space-y-4 animate-slide-in-right">
            <div className="p-4 rounded-lg bg-gradient-team-b">
              <Input
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="text-2xl font-bold text-center bg-card/50 border-team-b"
                placeholder="Team B Name"
              />
            </div>
            <div className="space-y-2">
              {teamBPlayers.map((player, idx) => (
                <Input
                  key={`team-b-${idx}`}
                  value={player}
                  onChange={(e) => {
                    const newPlayers = [...teamBPlayers];
                    newPlayers[idx] = e.target.value;
                    setTeamBPlayers(newPlayers);
                  }}
                  placeholder={`Player ${idx + 1}`}
                  className="bg-muted border-team-b/30 focus:border-team-b"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            size="lg"
            className="bg-gradient-pitch hover:scale-105 transition-transform text-lg px-12 py-6"
          >
            Start Match
          </Button>
        </div>
      </Card>
    </div>
  );
};
