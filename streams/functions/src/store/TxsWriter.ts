import * as admin from 'firebase-admin';

import { TxDocument } from '../txs-processor/TxDocumentBuilder';
import { TxDocumentUpdate } from '../txs-processor/TxsProcessor';

export class TxsWriter {
  public constructor(private readonly store: admin.firestore.Firestore) {}

  public writeMany(updates: TxDocumentUpdate[]): Promise<void>[] {
    return updates.map((update) => this.store.runTransaction(() => this.write(update)));
  }

  private async write(update: TxDocumentUpdate): Promise<void> {
    const collection = this.store.collection(`moralis/txs/${update.collectionName}`);

    const itemDoc = collection.doc(update.document.id);

    if (!update.document.confirmed) {
      const item = await itemDoc.get();
      if (item.exists) {
        const log = item.data() as TxDocument;
        if (log.confirmed) {
          // We don't update a confirmed item with a non confirmed item.
          return;
        }
      }
    }

    await itemDoc.set({
      ...update.document,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
