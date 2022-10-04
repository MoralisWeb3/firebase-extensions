import { IWebhook } from '@moralisweb3/streams-typings';

import { CollectionNameBuilder } from '../core/CollectionNameBuilder';
import { TxRow, TxRowBuilder } from './TxRowBuilder';

export class TxsProcessor {
  private readonly collectionNameBuilder = new CollectionNameBuilder();

  public process(batch: IWebhook): TxRowUpdate[] {
    const updates: TxRowUpdate[] = [];

    for (const tx of batch.txs) {
      const row = TxRowBuilder.build(tx, batch.block, batch.confirmed);

      updates.push({
        tableName: this.collectionNameBuilder.build(tx.tag),
        row,
      });
    }

    return updates;
  }
}

export interface TxRowUpdate {
  tableName: string;
  row: TxRow;
}
