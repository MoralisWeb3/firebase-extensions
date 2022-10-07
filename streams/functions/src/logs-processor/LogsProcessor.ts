import { IWebhook } from '@moralisweb3/streams-typings';

import { CollectionNameBuilder } from '../core/CollectionNameBuilder';
import { LogParser } from './LogParser';
import { LogRow, LogRowBuilder } from './LogRowBuilder';

export class LogsProcessor {
  private readonly collectionNameBuilder = new CollectionNameBuilder();

  public process(batch: IWebhook): LogRowUpdate[] {
    const updates: LogRowUpdate[] = [];

    const logParsers: Record<string, LogParser> = {};
    for (const streamId of Object.keys(batch.abis)) {
      logParsers[streamId] = new LogParser(batch.abis[streamId]);
    }

    for (const log of batch.logs) {
      const logParser = logParsers[log.streamId];
      if (!logParser) {
        continue;
      }

      const logParams = logParser.read(log);
      const row = LogRowBuilder.build(log, logParams, batch.block, batch.confirmed, batch.chainId);

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
