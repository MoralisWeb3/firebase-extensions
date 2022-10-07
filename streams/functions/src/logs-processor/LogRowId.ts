import { ethers } from 'ethers';

export class LogRowId {
  public static create(transactionHash: string, logIndex: string): string {
    const safeTransactionHash = transactionHash.toLowerCase();
    const rawId = ethers.utils.toUtf8Bytes(`${safeTransactionHash};${logIndex}`);
    return ethers.utils.sha256(rawId);
  }
}
