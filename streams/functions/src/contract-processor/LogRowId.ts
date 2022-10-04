import { ethers } from 'ethers';

export class LogRowId {
  public static create(transactionHash: string, logIndex: string): string {
    const rawId = ethers.utils.toUtf8Bytes(transactionHash.toLowerCase() + ';' + logIndex);
    return ethers.utils.sha256(rawId);
  }
}
