import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Moralis from 'moralis';

import { IWebhook } from '@moralisweb3/streams-typings';

import { config } from './config';
import { LogsProcessor } from './contract-processor/LogsProcessor';
import { LogsWriter } from './store/LogsWriter';
import { TxsWriter } from './store/TxsWriter';
import { TxsProcessor } from './txs-processor/TxsProcessor';

const app = admin.initializeApp();
const db = app.firestore();

Moralis.start({
  apiKey: config.moralisApiKey,
});

const logsProcessor = new LogsProcessor();
const txsProcessor = new TxsProcessor();

const logsWriter = new LogsWriter(db);
const txsWriter = new TxsWriter(db);

export const webhook = functions.https.onRequest(async (req, res) => {
  const batch = req.body as IWebhook;
  const signature = req.headers['x-signature'] as string;

  const isValidBatch =
    !!batch &&
    !!signature &&
    Moralis.Streams.verifySignature({
      body: batch as any,
      signature,
    });
  if (!isValidBatch) {
    res.status(400).send('Invalid signature');
    return;
  }

  const logUpdates = logsProcessor.process(batch);
  const txUpdates = txsProcessor.process(batch);

  const transactions = [...logsWriter.writeMany(logUpdates), ...txsWriter.writeMany(txUpdates)];

  await Promise.all(transactions);

  res.status(200).send('OK');
});
