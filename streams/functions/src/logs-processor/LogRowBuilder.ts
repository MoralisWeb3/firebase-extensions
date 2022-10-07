import { Block, Log } from '@moralisweb3/streams-typings';

import { LogParams } from './LogParamsParser';
import { LogRowId } from './LogRowId';
import { LogRowValueFormatter } from './LogRowValueFormatter';
import { RowParamNameResolver } from './RowParamNameResolver';

interface BaseLogRow {
  id: string;
  logIndex: number;
  transactionHash: string;
  address: string;
  blockHash: string;
  blockTimestamp: number;
  blockNumber: number;
  confirmed: boolean;
}

export interface LogRow extends BaseLogRow {
  [logParamName: string]: LogRowValue;
}

export type LogRowValue = string | number | boolean;

const logRowParamNames: (keyof BaseLogRow)[] = [
  'id',
  'logIndex',
  'transactionHash',
  'address',
  'blockHash',
  'blockTimestamp',
  'blockNumber',
  'confirmed',
];

const restrictedParamNames: string[] = [
  ...logRowParamNames,
  // Some extra names
  '_id',
  'uniqueId',
  'updatedAt',
  'createdAt',
];

export class LogRowBuilder {
  public static build(log: Log, logParams: LogParams, block: Block, confirmed: boolean): LogRow {
    const nameResolver = new RowParamNameResolver(restrictedParamNames);

    const row: LogRow = {
      id: LogRowId.create(log.transactionHash, log.logIndex),
      logIndex: parseInt(log.logIndex, 10),
      transactionHash: log.transactionHash,
      address: log.address,
      blockHash: block.hash,
      blockTimestamp: parseInt(block.timestamp, 10),
      blockNumber: parseInt(block.number, 10),
      confirmed,
    };

    nameResolver.iterate(logParams, (safeParamName, paramValue) => {
      row[safeParamName] = LogRowValueFormatter.format(paramValue);
    });
    return row;
  }
}
