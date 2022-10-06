import { IWebhook } from '@moralisweb3/streams-typings';

import { CollectionNameBuilder } from '../core/CollectionNameBuilder';
import { LogParamsParser } from './LogParamsParser';
import { LogRow, LogRowBuilder } from './LogRowBuilder';

export class LogsProcessor {
  private readonly collectionNameBuilder = new CollectionNameBuilder();

  public process(batch: IWebhook): LogRowUpdate[] {
    const updates: LogRowUpdate[] = [];

    for (let log of batch.logs) {
      const abi = batch.abis[log.streamId];
      if (!abi) {
        // Transaction batches don't contain ABIs.
        continue;
      }

      const logParams = LogParamsParser.read(log, abi);
      const row = LogRowBuilder.build(log, logParams, batch.block, batch.confirmed);

      updates.push({
        tableName: this.collectionNameBuilder.build(log.tag),
        row,
      });
    }

    return updates;
  }
}

export interface LogRowUpdate {
  tableName: string;
  row: LogRow;
}
