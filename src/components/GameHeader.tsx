import { Shield, Gamepad2 } from "lucide-react";

export const GameHeader = () => {
  return (
    <header className="relative border-b border-primary/30 bg-gradient-arcade">
      <div className="absolute inset-0 arcade-grid opacity-20" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-12 h-12 text-neon-cyan animate-pulse-glow" />
              <div className="absolute inset-0 w-12 h-12 text-neon-cyan opacity-30 animate-ping" />
            </div>
            <Gamepad2 className="w-10 h-10 text-neon-magenta animate-flicker" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider">
              <span className="text-neon-cyan neon-glow">GAMING</span>{" "}
              <span className="text-neon-magenta">FAIRNESS</span>
            </h1>
            <div className="text-xl md:text-2xl text-neon-lime font-mono tracking-widest">
              WITH FHE
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Encrypted leaderboards that prevent mid-tournament sniping and score manipulation. 
              Fair competition through cryptographic innovation.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};