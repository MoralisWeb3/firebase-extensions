import { IWebhook } from '@moralisweb3/streams-typings';
import { CollectionNameBuilder } from '../core/CollectionNameBuilder';
import { Update } from '../storage/Update';
import { InternalTxDocument, InternalTxDocumentBuilder } from './InternalTxDocumentBuilder';

export class InternalTxsProcessor {
  public constructor(private readonly collectionNameBuilder: CollectionNameBuilder) {}

  public process(batch: IWebhook): TxDocumentUpdate[] {
    const updates: TxDocumentUpdate[] = [];

    for (const internalTx of batch.txsInternal) {
      const document = InternalTxDocumentBuilder.build(internalTx, batch.block, batch.confirmed, batch.chainId);

      updates.push({
        collectionName: this.collectionNameBuilder.build(batch.tag),
        document,
      });
    }

    return updates;
  }
}

export interface TxDocumentUpdate extends Update<InternalTxDocument> {
  collectionName: string;
  document: InternalTxDocument;
}
