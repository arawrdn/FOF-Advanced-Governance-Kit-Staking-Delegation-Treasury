// backend/ipfsService.ts

import { create } from 'ipfs-http-client';

// Configuration: Assume we use Pinata or a public IPFS gateway
const IPFS_CLIENT_CONFIG = {
  host: 'ipfs.infura.io', // Example IPFS host
  port: 5001,
  protocol: 'https',
};

// Create an instance of the IPFS client
const ipfs = create(IPFS_CLIENT_CONFIG);

/**
 * Stores JSON proposal data on IPFS and returns the Content Hash (CID).
 * * @param proposalData The structured JSON data of the proposal.
 * @returns The CID string of the pinned data.
 */
export async function pinProposalToIPFS(proposalData: any): Promise<string> {
  try {
    const jsonString = JSON.stringify(proposalData);
    
    // Convert string to Uint8Array buffer
    const buffer = Buffer.from(jsonString);

    // Add the buffer to IPFS
    const result = await ipfs.add(buffer);
    
    const cid = result.cid.toString();
    console.log(`Proposal pinned to IPFS. CID: ${cid}`);
    
    // The link to view the proposal: https://ipfs.io/ipfs/${cid}
    return cid;

  } catch (error) {
    console.error("Error pinning to IPFS:", error);
    throw new Error("Failed to save proposal data to IPFS.");
  }
}
