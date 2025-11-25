// frontend/src/config/abis.ts

// Minimal ABI for VoteManager.sol (Address: 0xa1D5aC2C86A4215Bfb64738cd5655fEf8A21Bce8)
// Assuming a 'vote' function exists based on its name and purpose.
export const VOTE_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "internalType": "uint8", "name": "support", "type": "uint8" }
    ],
    "name": "vote",
    "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    // ... other view functions like 'getProposalDetails', etc.
  }
] as const;


// Minimal ABI for FOFStakingDelegator.sol
export const FOF_DELEGATOR_ABI = [
  {
    "inputs": [ { "internalType": "address", "name": "delegatee", "type": "address" } ],
    "name": "delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ],
    "name": "getVotingPower",
    "outputs": [ { "internalType": "uint256", "name": "power", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  // ... functions for 'stake', 'unstake', etc.
] as const;
