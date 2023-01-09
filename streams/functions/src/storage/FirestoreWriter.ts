import { Document, Update } from 'moralis/streams';
import * as admin from 'firebase-admin';

export class FirestoreWriter {
  public constructor(private readonly firestore: admin.firestore.Firestore) {}

  public writeMany(basePath: string, updates: Update[]): Promise<void>[] {
    return updates.map((update) => this.firestore.runTransaction(() => this.write(basePath, update)));
  }

  private async write(basePath: string, update: Update): Promise<void> {
    const collection = this.firestore.collection(`${basePath}/${update.collectionName}`);

    const itemDoc = collection.doc(update.document.id);

    if (!update.document.confirmed) {
      const item = await itemDoc.get();
      if (item.exists) {
        const doc = item.data() as Document;
        if (doc.confirmed) {
          // We don't update a confirmed document by an unconfirmed document.
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
