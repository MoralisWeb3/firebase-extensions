import * as admin from 'firebase-admin';

import { LogDocument } from '../logs-processor/LogDocumentBuilder';
import { LogDocumentUpdate } from '../logs-processor/LogsProcessor';

export class LogsWriter {
  public constructor(private readonly store: admin.firestore.Firestore) {}

  public writeMany(updates: LogDocumentUpdate[]): Promise<void>[] {
    return updates.map((update) => this.store.runTransaction(() => this.write(update)));
  }

  private async write(update: LogDocumentUpdate): Promise<void> {
    const collection = this.store.collection(`moralis/events/${update.collectionName}`);

    const itemDoc = collection.doc(update.document.id);

    if (!update.document.confirmed) {
      const item = await itemDoc.get();
      if (item.exists) {
        const log = item.data() as LogDocument;
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
