// frontend/src/hooks/useGovernance.ts

import { useCallback, useState, useEffect } from 'react';
import { useWallet } from '@reown/appkit'; // Leveraging @reown/appkit
import { Interface } from 'ethers'; // Helper for encoding data
import { VOTE_MANAGER_ABI, FOF_DELEGATOR_ABI } from '../config/abis';
import { VITE_VOTEMANAGER_ADDRESS, VITE_FOF_STAKING_ADDRESS } from '../config/constants';

// Initialize Ethers Interfaces for function encoding
const voteManagerInterface = new Interface(VOTE_MANAGER_ABI);
const delegatorInterface = new Interface(FOF_DELEGATOR_ABI);

export const useGovernance = () => {
  const { isConnected, address, provider, sendTransaction } = useWallet();
  const [votingPower, setVotingPower] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Read Function: Get Voting Power ---
  useEffect(() => {
    const fetchVotingPower = async () => {
      if (!isConnected || !address || !provider) {
        setVotingPower(0);
        return;
      }
      try {
        // Here we interact directly with the Blockchain provider
        const encodedData = delegatorInterface.encodeFunctionData('getVotingPower', [address]);
        
        // Use a standard JSON-RPC call (or a library like Ethers/Wagmi built on top of the provider)
        // to call the view function. @reown/appkit's provider should facilitate this.
        
        // For simplicity, let's assume a direct provider call for view function
        // NOTE: In a professional setup, you'd use provider.call() or a similar method.
        // For this example, we mock a successful power fetch.
        console.log(`Fetching power for ${address} using WalletConnect Provider...`);
        const mockPower = Math.floor(Math.random() * 10) + 1; // Mock: 1 to 10 power
        setVotingPower(mockPower);

      } catch (err) {
        console.error("Failed to fetch voting power:", err);
        setVotingPower(0);
      }
    };

    fetchVotingPower();
  }, [isConnected, address, provider]);


  // --- Write Function 1: Voting via WalletConnect ---
  const castVote = useCallback(async (proposalId: number, support: number) => {
    if (!isConnected || !address) {
      setError("Wallet not connected. Please connect via WalletConnect.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Encode the function call for your VoteManager contract (0xa1D5aC2C86A4215Bfb64738cd5655fEf8A21Bce8)
      const encodedData = voteManagerInterface.encodeFunctionData('vote', [BigInt(proposalId), support]);

      // 2. Use @reown/appkit's sendTransaction for seamless WalletConnect interaction
      const txHash = await sendTransaction({
        to: VITE_VOTEMANAGER_ADDRESS,
        data: encodedData,
        value: '0',
      });
      
      console.log(`Vote Tx Hash via WalletConnect: ${txHash}`);
      alert(`Vote transaction sent! Hash: ${txHash}`);

    } catch (err) {
      console.error("Error casting vote:", err);
      setError("Transaction failed or was rejected by the wallet.");
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, sendTransaction]);


  // --- Write Function 2: Delegation via WalletConnect ---
  const delegateVotingPower = useCallback(async (delegateeAddress: string) => {
    if (!isConnected || !address) {
      setError("Wallet not connected. Please connect via WalletConnect.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Encode the function call for the FOFStakingDelegator contract
      const encodedData = delegatorInterface.encodeFunctionData('delegate', [delegateeAddress]);

      // 2. Use @reown/appkit's sendTransaction
      const txHash = await sendTransaction({
        to: VITE_FOF_STAKING_ADDRESS,
        data: encodedData,
        value: '0',
      });

      console.log(`Delegation Tx Hash via WalletConnect: ${txHash}`);
      alert(`Delegation transaction sent! Delegatee: ${delegateeAddress}`);

    } catch (err) {
      console.error("Error delegating:", err);
      setError("Delegation transaction failed or was rejected.");
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, sendTransaction]);


  return {
    isConnected,
    address,
    votingPower,
    loading,
    error,
    castVote,
    delegateVotingPower,
  };
};
