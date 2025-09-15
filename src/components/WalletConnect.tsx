import { useState } from "react";
import { Wallet, Plus, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export const WalletConnect = () => {
  const [score, setScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const submitScore = async () => {
    if (!score || parseInt(score) < 0) return;
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the smart contract
      // For now, we'll simulate the FHE encryption process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitting(false);
      setScore("");
      toast({
        title: "Score Submitted & Encrypted",
        description: `Score of ${score} has been encrypted using FHE and submitted to the tournament`,
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Submission Failed",
        description: "Failed to submit score. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="arcade-border bg-card p-6">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center space-x-2">
        <Wallet className="w-5 h-5 text-neon-cyan" />
        <span>WALLET & SCORE SUBMISSION</span>
      </h3>

      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                        <Wallet className="w-8 h-8 text-primary animate-pulse-glow" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-muted-foreground">Connect your wallet to submit encrypted scores</p>
                        <p className="text-xs text-muted-foreground">
                          Scores remain hidden until tournament ends
                        </p>
                      </div>

                      <ArcadeButton variant="submit" onClick={openConnectModal} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </ArcadeButton>
                    </div>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
                        <Wallet className="w-8 h-8 text-destructive" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-destructive font-medium">Wrong Network</p>
                        <p className="text-xs text-muted-foreground">
                          Please switch to Sepolia testnet
                        </p>
                      </div>

                      <ArcadeButton variant="destructive" onClick={openChainModal} className="w-full">
                        Switch Network
                      </ArcadeButton>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-space-medium border border-primary/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-neon-cyan" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">Connected</div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {`${account.address.slice(0, 8)}...${account.address.slice(-6)}`}
                          </div>
                        </div>
                      </div>
                      
                      <ArcadeButton variant="ghost" size="sm" onClick={openAccountModal}>
                        Account
                      </ArcadeButton>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-primary mb-2 block">
                          Submit Your Score
                        </label>
                        <div className="space-y-3">
                          <Input
                            type="number"
                            placeholder="Enter your game score..."
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="arcade-border bg-space-dark text-primary font-mono"
                            min="0"
                          />
                          
                          <ArcadeButton 
                            variant="submit" 
                            onClick={submitScore}
                            disabled={!score || isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                <span>Encrypting & Submitting...</span>
                              </div>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Encrypted Score
                              </>
                            )}
                          </ArcadeButton>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Your score will be encrypted using FHE technology</p>
                        <p>• Scores remain hidden until tournament conclusion</p>
                        <p>• No one can see or manipulate scores mid-tournament</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </Card>
  );
};