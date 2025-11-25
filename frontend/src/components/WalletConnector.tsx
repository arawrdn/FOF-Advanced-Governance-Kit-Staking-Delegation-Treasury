import React, { useEffect, useState } from 'react';
import { WalletProvider, useWallet, ConnectButton } from '@reown/appkit';
import { initializeWalletConnect } from '../services/WalletConnectService';
import { VITE_WALLETCONNECT_PROJECT_ID, VITE_RPC_URL } from '../config/constants';

const WalletConnector: React.FC = ({ children }) => {
  const [walletInitialized, setWalletInitialized] = useState(false);

  useEffect(() => {
    // Ensure the core WalletConnect service is initialized 
    // before the high-level AppKit provider is used.
    initializeWalletConnect().then(() => {
        setWalletInitialized(true);
    }).catch(console.error);
  }, []);

  if (!walletInitialized) {
    return <div>Initializing Wallet System...</div>;
  }
  
  // AppKit Provider wraps the application for easy access to wallet state
  return (
    <WalletProvider 
      projectId={VITE_WALLETCONNECT_PROJECT_ID} // Using your specific Project ID
      rpcUrl={VITE_RPC_URL}
    >
      {children}
    </WalletProvider>
  );
};

// --- Component to be used in the Governance Dashboard ---

export const GovernanceConnectWidget: React.FC = () => {
  const { isConnected, address, chainId, signMessage, sendTransaction } = useWallet();

  if (!isConnected) {
    // Using AppKit's ready-made button
    return (
      <div className="p-4 border rounded-lg bg-gray-800">
        <p className="text-white mb-3">Connect your wallet to manage FOF Staking & Governance rights.</p>
        <ConnectButton label="Connect FOF Wallet" /> 
      </div>
    );
  }

  // Example logic for interacting with VoteManager.sol
  const handleVote = async () => {
    // 1. Encode the function call (e.g., VoteManager.vote(proposalId, support))
    const encodedData = '0x...'; // Ethers utility function to encode call to 0xa1D5aC2C86A4215Bfb64738cd5655fEf8A21Bce8

    try {
      // 2. Use AppKit's simplified sendTransaction method
      const txHash = await sendTransaction({
        to: VITE_VOTEMANAGER_ADDRESS, 
        data: encodedData,
        value: '0',
      });
      alert(`Vote submitted! Tx Hash: ${txHash}`);
    } catch (error) {
      console.error("Voting failed:", error);
      alert("Transaction rejected or failed.");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-green-800">
      <p className="text-white">Connected: {address} on Chain ID {chainId}</p>
      <button onClick={handleVote} className="mt-3 p-2 bg-blue-500 text-white rounded">
        Execute Vote via WalletConnect
      </button>
      {/* Delegation UI and Staking UI would also use this pattern */}
    </div>
  );
};

export default WalletConnector;
