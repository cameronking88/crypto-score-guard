import { GameHeader } from "@/components/GameHeader";
import { Leaderboard } from "@/components/Leaderboard";
import { WalletConnect } from "@/components/WalletConnect";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Leaderboard />
          </div>
          
          <div className="space-y-6">
            <WalletConnect />
            
            {/* Game Rules Card */}
            <div className="arcade-border bg-card p-6">
              <h3 className="text-lg font-bold text-neon-lime mb-3">GAME RULES</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Submit scores during tournament period</p>
                <p>• All scores encrypted via FHE until reveal</p>
                <p>• No mid-tournament sniping possible</p>
                <p>• Fair competition guaranteed</p>
                <p>• Winner announced after reveal</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-primary/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="text-neon-cyan font-bold">Fully Homomorphic Encryption</span> • 
            Fair Gaming Revolution
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
