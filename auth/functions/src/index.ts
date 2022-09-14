
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';
import { userExists } from './userExists';
import { config } from './config';
import { cert } from 'firebase-admin/app';

Moralis.start({
    apiKey: config.moralisApiKey,
});

const app = admin.initializeApp({
  credential: cert({
    projectId: config.serviceAccountProjectId,
    clientEmail: config.serviceAccountEmail,
    privateKey: config.serviceAccountPrivateKey,
  })
});
const auth = admin.auth(app);

// ~/ext-moralis-auth-requestMessage

interface RequestEvmMessageData {
    address: string;
    chain: number;
}

export const requestMessage = functions.handler.https.onCall(async (data: RequestEvmMessageData) => {
  const now = new Date();
  const oneDay = 86400000;
  const expirationTime = new Date(now.getTime() + oneDay);

  const websiteUrl = new URL(config.websiteUri);
  const response = await Moralis.Auth.requestMessage({
    network: 'evm',
    chain: EvmChain.create(data.chain),
    timeout: 15,
    domain: websiteUrl.hostname,
    uri: websiteUrl.toString(),
    statement: 'To authenticate please sign this message',
    address: data.address,
    notBefore: now.toISOString(),
    expirationTime: expirationTime.toISOString(),
  });
  return response.raw;
});

// ~/ext-moralis-auth-issueToken

interface IssueTokenData {
  message: string;
  signature: string;
}

export const issueToken = functions.handler.https.onCall(async (data: IssueTokenData) => {
  const response = await Moralis.Auth.verify({
    network: 'evm',
    message: data.message,
    signature: data.signature,
  });
  const uid = response.result.profileId;

  if (!(await userExists(auth, uid))) {
    await auth.createUser({
      uid,
      displayName: response.result.address.checksum,
    });
  }

  const token = await auth.createCustomToken(uid);
  return { token };
});
