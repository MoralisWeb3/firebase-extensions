import * as admin from 'firebase-admin';

import { LogRow } from '../contract-processor/LogRowBuilder';
import { LogRowUpdate } from '../contract-processor/LogsProcessor';

export class LogsWriter {
  public constructor(private readonly store: admin.firestore.Firestore) {}

  public writeMany(updates: LogRowUpdate[]): Promise<void>[] {
    return updates.map((update) => this.store.runTransaction(() => this.write(update)));
  }

  private async write(update: LogRowUpdate): Promise<void> {
    const collection = this.store.collection(`moralis/events/${update.tableName}`);

    const itemDoc = collection.doc(update.row.id);

    if (!update.row.confirmed) {
      const item = await itemDoc.get();
      if (item.exists) {
        const log = item.data() as LogRow;
        if (log.confirmed) {
          // We don't update a confirmed record by not confirmed record.
          return;
        }
      }
    }

    await itemDoc.set(update.row);
  }
}
