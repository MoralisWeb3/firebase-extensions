import * as admin from 'firebase-admin';

import { TxRowUpdate } from '../txs-processor/TxsProcessor';

export class TxsWriter {
  public constructor(private readonly store: admin.firestore.Firestore) {}

  public writeMany(updates: TxRowUpdate[]): Promise<void>[] {
    // We don't need a db transaction here, because the `set()` is an atomic operation.
    return updates.map((update) => this.write(update));
  }

  private async write(update: TxRowUpdate): Promise<void> {
    const collection = this.store.collection(`moralis/txs/${update.tableName}`);

    const itemDoc = collection.doc(update.row.id);
    itemDoc.set(update.row);
  }
}
