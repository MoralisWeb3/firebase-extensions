import { Block, Log } from '@moralisweb3/streams-typings';

import { ParsedLog } from './LogParser';
import { LogRowId } from './LogRowId';
import { LogRowValueFormatter } from './LogRowValueFormatter';
import { RowParamNameResolver } from './RowParamNameResolver';

interface BaseLogRow {
  id: string;
  name: string;
  logIndex: number;
  transactionHash: string;
  address: string;
  blockHash: string;
  blockTimestamp: number;
  blockNumber: number;
  confirmed: boolean;
  chainId: number;
}

export interface LogRow extends BaseLogRow {
  [logParamName: string]: LogRowValue;
}

export type LogRowValue = string | number | boolean;

const logRowParamNames: (keyof BaseLogRow)[] = [
  'id',
  'name',
  'logIndex',
  'transactionHash',
  'address',
  'blockHash',
  'blockTimestamp',
  'blockNumber',
  'confirmed',
  'chainId',
];

const restrictedParamNames: string[] = [
  ...logRowParamNames,
  // Some extra names
  '_id',
  'uniqueId',
  'updatedAt',
  'createdAt',
  'user',
  'userId',
];

export class LogRowBuilder {
  public static build(log: Log, parsedLog: ParsedLog, block: Block, confirmed: boolean, chainId: string): LogRow {
    const nameResolver = new RowParamNameResolver(restrictedParamNames);
    const chain = Number(chainId);

    const row: LogRow = {
      id: LogRowId.create(chain, log.transactionHash, log.logIndex),
      name: parsedLog.name,
      logIndex: parseInt(log.logIndex, 10),
      transactionHash: log.transactionHash,
      address: log.address,
      blockHash: block.hash,
      blockTimestamp: parseInt(block.timestamp, 10),
      blockNumber: parseInt(block.number, 10),
      confirmed,
      chainId: chain,
    };

    nameResolver.iterate(parsedLog.params, (safeParamName, paramValue) => {
      row[safeParamName] = LogRowValueFormatter.format(paramValue);
    });
    return row;
  }
}
