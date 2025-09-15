// Configuration file for Crypto Score Guard
export const config = {
  chainId: 11155111, // Sepolia testnet
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_WALLET_CONNECT_PROJECT_ID",
  infuraApiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || "YOUR_INFURA_API_KEY",
  alternativeRpcUrl: "https://1rpc.io/sepolia",
  
  // Smart contract addresses (to be deployed)
  contractAddress: "", // Will be set after deployment
  
  // Tournament settings
  tournament: {
    defaultDuration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    minScore: 0,
    maxScore: 1000000,
  },
  
  // FHE settings
  fhe: {
    enabled: true,
    encryptionKey: "", // Will be generated
  }
};
