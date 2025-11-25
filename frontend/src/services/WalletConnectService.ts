import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@web3modal/wallet';
import { IWeb3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet';

// Your Project ID is highlighted here
const PROJECT_ID = process.env.VITE_WALLETCONNECT_PROJECT_ID || 'a5f9260bc9bca570190d3b01f477fc45'; 
let web3Wallet: IWeb3Wallet;

/**
 * Initializes WalletConnect Core and Web3Wallet.
 */
export async function initializeWalletConnect() {
  if (!PROJECT_ID) {
    throw new Error("WalletConnect Project ID is missing.");
  }

  const core = new Core({ 
    projectId: PROJECT_ID,
  });

  // We are using @walletconnect/core for the underlying protocol logic
  web3Wallet = await Web3Wallet.init({ 
    core,
    metadata: {
      name: 'FOF Governance DApp',
      description: 'FOF NFT Staking and Delegation Governance Platform',
      url: 'https://fof.governance',
      icons: ['https://fof.governance/icon.png'],
    },
  });

  console.log("WalletConnect Core Initialized with Project ID:", PROJECT_ID);

  // Example listener for session proposals (if acting as a wallet)
  web3Wallet.on('session_proposal', (proposal: Web3WalletTypes.SessionProposal) => {
    // Logic to handle new connection request
  });

  return web3Wallet;
}

/**
 * Prepares and sends a transaction (e.g., Voting on VoteManager.sol).
 * This function utilizes the established WalletConnect session.
 */
export async function sendTransaction(address: string, data: string) {
  // In a real dApp, you would use @reown/appkit to handle the UI-triggered 'sign' or 'send' calls 
  // which internally uses the core session established here.
  
  // For demonstration, this is where the raw transaction request is formatted:
  const tx = {
    from: address,
    to: VITE_VOTEMANAGER_ADDRESS, // Using your VoteManager contract
    data: data, // Encoded function call for VoteManager.vote() or Delegation function
    value: '0x0',
    gas: '0x5208' // Example gas limit
  };

  // The actual sending mechanism would be wrapped by the @reown/appkit provider/hook 
  // for seamless UI integration.
  console.log("Transaction prepared for VoteManager:", tx);
  // return web3Wallet.request(requestParams); // Simplified conceptual call
}

// Exported for AppKit to use
export default web3Wallet;
