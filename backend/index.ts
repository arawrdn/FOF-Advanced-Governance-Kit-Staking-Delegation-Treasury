// backend/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import { pinProposalToIPFS } from './ipfsService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- POST Endpoint: Create Proposal (Off-Chain) ---
app.post('/api/proposal/create', async (req: Request, res: Response) => {
  const { title, description, executionDetails, proposerAddress } = req.body;

  if (!title || !description || !proposerAddress) {
    return res.status(400).json({ error: "Missing required proposal fields." });
  }

  // 1. Structure the data to be pinned
  const proposalData = {
    title,
    description,
    proposer: proposerAddress,
    timestamp: new Date().toISOString(),
    execution: executionDetails || null, // Optional details for Treasury action
  };

  try {
    // 2. Pin the full proposal details to IPFS
    const ipfsHash = await pinProposalToIPFS(proposalData);

    // 3. Return the hash to the frontend
    // The frontend will then take this hash and send an on-chain transaction
    // to VoteManager.sol to officially register the proposal.
    return res.status(200).json({ 
      message: "Proposal data successfully pinned to IPFS.",
      ipfsHash: ipfsHash 
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal server error during IPFS pinning." });
  }
});

// Simple health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('FOF Governance Backend Running.');
});

app.listen(PORT, () => {
  console.log(`FOF Governance Backend listening on port ${PORT}`);
});
