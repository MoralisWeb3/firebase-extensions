import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { config } from './config';
import { FirestoreWriter } from './storage/FirestoreWriter';
import Moralis from 'moralis';
import { CoreConfig } from 'moralis/common-core';
import { BatchProcessor } from 'moralis/streams';
import { IWebhook } from '@moralisweb3/streams-typings';

const app = admin.initializeApp();
const firestore = app.firestore();
firestore.settings({
  ignoreUndefinedProperties: true,
});

Moralis.start({
  apiKey: config.moralisApiKey,
});
Moralis.Core.config.set(CoreConfig.product, 'firebase-streams');

const batchProcessor = BatchProcessor.create();

const firestoreWriter = new FirestoreWriter(firestore);

export const webhook = functions.handler.https.onRequest(async (req, res) => {
  const batch = req.body as IWebhook;
  const signature = req.headers['x-signature'] as string;

  const isValidBatch =
    !!batch &&
    !!signature &&
    Moralis.Streams.verifySignature({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: batch as any,
      signature,
    });
  if (!isValidBatch) {
    res.status(400).send('Invalid signature');
    return;
  }

  const result = batchProcessor.process(batch);

  const transactions = [
    ...firestoreWriter.writeMany('moralis/events', result.logs()),
    ...firestoreWriter.writeMany('moralis/txs', result.txs()),
    ...firestoreWriter.writeMany('moralis/internalTxs', result.internalTxs()),
    ...firestoreWriter.writeMany('moralis/erc20Transfers', result.erc20Transfers()),
    ...firestoreWriter.writeMany('moralis/erc20Approvals', result.erc20Approvals()),
    ...firestoreWriter.writeMany('moralis/nftTransfers', result.nftTransfers()),
    ...firestoreWriter.writeMany('moralis/nftApprovals', result.nftApprovals()),
  ];

  await Promise.all(transactions);
  res.status(200).send('OK');
});
