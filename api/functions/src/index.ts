import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CoreConfig } from '@moralisweb3/common-core';
import Moralis from 'moralis';
import { CallableContext } from 'firebase-functions/v1/https';
import { RequestHandlerResolver } from './RequestHandlerResolver';
import { RateLimiter } from './RateLimiter';
import { config } from './config';

const app = admin.initializeApp();
const firestore = app.firestore();
const rateLimiter = RateLimiter.tryCreate(firestore, config.maxIpCallsPerMinute);

Moralis.start({
  apiKey: config.moralisApiKey,
});
Moralis.Core.config.set(CoreConfig.product, 'firebase-api');

interface CallRequestData {
  operationName: string;
  moduleName: string;
  request: unknown;
}

export const call = functions.https.onCall(async (data: CallRequestData, context: CallableContext) => {
  if (rateLimiter) {
    await rateLimiter.ensure(context.rawRequest);
  }

  const requestHandler = RequestHandlerResolver.tryResolve(data.moduleName, data.operationName);
  if (!requestHandler) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Operation ${data.moduleName}/${data.operationName} is not supported`,
    );
  }

  const response = await requestHandler.handle(data.request);
  return response;
});
