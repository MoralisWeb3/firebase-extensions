import { ethers } from 'ethers';

export class TxRowId {
  public static create(transactionHash: string): string {
    const rawId = ethers.utils.toUtf8Bytes(transactionHash.toLowerCase());
    return ethers.utils.sha256(rawId);
  }
}
