import { Document, Update } from 'moralis/streams';
import * as admin from 'firebase-admin';

export class FirestoreWriter {
  public constructor(private readonly firestore: admin.firestore.Firestore) {}

  public writeMany(basePath: string, updates: Update[]): Promise<void>[] {
    return updates.map((update) =>
      this.firestore.runTransaction((transaction) => this.write(transaction, basePath, update)),
    );
  }

  private async write(transaction: admin.firestore.Transaction, basePath: string, update: Update): Promise<void> {
    const itemDoc = this.firestore.collection(`${basePath}/${update.collectionName}`).doc(update.document.id);

    if (!update.document.confirmed) {
      const item = await transaction.get(itemDoc);
      if (item.exists) {
        const doc = item.data() as Document;
        if (doc.confirmed) {
          // We don't update a confirmed document by an unconfirmed document.
          return;
        }
      }
    }

    transaction.set(itemDoc, {
      ...update.document,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
