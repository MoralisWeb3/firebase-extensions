import * as admin from 'firebase-admin';

import { TxRow } from '../txs-processor/TxRowBuilder';
import { TxRowUpdate } from '../txs-processor/TxsProcessor';

export class TxsWriter {
  public constructor(private readonly store: admin.firestore.Firestore) {}

  public writeMany(updates: TxRowUpdate[]): Promise<void>[] {
    return updates.map((update) => this.store.runTransaction(() => this.write(update)));
  }

  private async write(update: TxRowUpdate): Promise<void> {
    const collection = this.store.collection(`moralis/txs/${update.collectionName}`);

    const itemDoc = collection.doc(update.row.id);

    if (!update.row.confirmed) {
      const item = await itemDoc.get();
      if (item.exists) {
        const log = item.data() as TxRow;
        if (log.confirmed) {
          // We don't update a confirmed item with a non confirmed item.
          return;
        }
      }
    }

    await itemDoc.set({
      ...update.row,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
