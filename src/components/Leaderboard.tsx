import { Trophy, Lock, Unlock, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { useState } from "react";

interface Player {
  id: string;
  address: string;
  score: number;
  encrypted: boolean;
  rank?: number;
}

const mockPlayers: Player[] = [
  { id: "1", address: "0x742d35Cc6634C0532925a3b8D9C4d8086d2995C3", score: 95420, encrypted: false, rank: 1 },
  { id: "2", address: "0x8ba1f109551bD432803012645Hac136c22f221F2", score: 87340, encrypted: false, rank: 2 },
  { id: "3", address: "0x1234567890123456789012345678901234567890", score: 0, encrypted: true },
  { id: "4", address: "0xAbCdEf123456789012345678901234567890AbCd", score: 0, encrypted: true },
  { id: "5", address: "0x9876543210987654321098765432109876543210", score: 0, encrypted: true },
];

export const Leaderboard = () => {
  const [tournamentActive, setTournamentActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("02:45:33");

  const revealScores = () => {
    setTournamentActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Tournament Status */}
      <Card className="tournament-status p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Trophy className="w-8 h-8 text-neon-yellow" />
              <div className="absolute inset-0 w-8 h-8 text-neon-yellow opacity-50 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Weekly Championship</h2>
          </div>
          
          {tournamentActive ? (
            <div className="encrypted-indicator">
              <Lock className="w-4 h-4" />
              SCORES ENCRYPTED
            </div>
          ) : (
            <div className="revealed-indicator">
              <Unlock className="w-4 h-4" />
              SCORES REVEALED
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-neon-cyan text-2xl font-mono score-digit">{mockPlayers.filter(p => !p.encrypted).length}</div>
            <div className="text-sm text-muted-foreground">Submitted Scores</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-neon-magenta text-2xl font-mono score-digit flex items-center justify-center space-x-1">
              <Clock className="w-5 h-5" />
              <span>{timeRemaining}</span>
            </div>
            <div className="text-sm text-muted-foreground">Time Remaining</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-neon-lime text-2xl font-mono score-digit">{mockPlayers.length}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Total Players</span>
            </div>
          </div>
        </div>

        {tournamentActive && (
          <div className="mt-4 flex justify-center">
            <ArcadeButton 
              variant="magenta" 
              onClick={revealScores}
              className="animate-pulse"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Reveal Scores (Admin)
            </ArcadeButton>
          </div>
        )}
      </Card>

      {/* Leaderboard */}
      <Card className="arcade-border bg-card p-6">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-neon-yellow" />
          <span>LEADERBOARD</span>
        </h3>

        <div className="space-y-2">
          {mockPlayers.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-4 rounded-lg bg-space-medium border border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {player.rank || index + 1}
                </div>
                
                <div>
                  <div className="font-mono text-sm text-muted-foreground">
                    {`${player.address.slice(0, 6)}...${player.address.slice(-4)}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {player.encrypted ? (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-neon-magenta" />
                    <div className="text-neon-magenta font-mono">ENCRYPTED</div>
                  </div>
                ) : (
                  <div className="score-digit text-xl font-bold">
                    {player.score.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};