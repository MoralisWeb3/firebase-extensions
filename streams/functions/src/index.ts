import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Moralis from 'moralis';
import { CoreConfig } from 'moralis/core';

import { IWebhook } from '@moralisweb3/streams-typings';

import { config } from './config';
import { LogsProcessor } from './logs-processor/LogsProcessor';
import { FirestoreWriter } from './storage/FirestoreWriter';
import { TxsProcessor } from './txs-processor/TxsProcessor';
import { CollectionNameBuilder } from './core/CollectionNameBuilder';
import { InternalTxsProcessor } from './internal-txs-processor/InternalTxsProcessor';

const app = admin.initializeApp();
const firestore = app.firestore();

Moralis.start({
  apiKey: config.moralisApiKey,
});
Moralis.Core.config.set(CoreConfig.product, 'firebase-streams');

const collectionNameBuilder = new CollectionNameBuilder();
const logsProcessor = new LogsProcessor(collectionNameBuilder);
const txsProcessor = new TxsProcessor(collectionNameBuilder);
const internalTxProcessor = new InternalTxsProcessor(collectionNameBuilder);

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

  const logUpdates = logsProcessor.process(batch);
  const txUpdates = txsProcessor.process(batch);
  const internalTxUpdates = internalTxProcessor.process(batch);

  const transactions = [
    ...firestoreWriter.writeMany('moralis/events', logUpdates),
    ...firestoreWriter.writeMany('moralis/txs', txUpdates),
    ...firestoreWriter.writeMany('moralis/internalTxs', internalTxUpdates),
  ];

  await Promise.all(transactions);
  res.status(200).send('OK');
});
