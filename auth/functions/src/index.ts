import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import Moralis from 'moralis';
import { EvmAddress, EvmChain } from '@moralisweb3/evm-utils';
import { SolAddress, SolNetwork } from '@moralisweb3/sol-utils';

import { config } from './config';
import { userExists } from './userExists';

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

type NetworkType = 'evm' | 'solana';

// ~/ext-moralis-auth-requestMessage

interface RequestMessageData {
  networkType: NetworkType;

  // evm:
  evmAddress?: string;
  evmChain?: number;

  // solana:
  solAddress?: string;
  solNetwork?: string;
}

export const requestMessage = functions.handler.https.onCall(async (data: RequestMessageData) => {
  const now = new Date();
  const fifteenMinutes = 900000;
  const expirationTime = new Date(now.getTime() + fifteenMinutes);
  const websiteUrl = new URL(config.websiteUri);

  const params = {
    timeout: 15,
    domain: websiteUrl.hostname,
    uri: websiteUrl.toString(),
    statement: 'To authenticate please sign this message.',
    notBefore: now.toISOString(),
    expirationTime: expirationTime.toISOString(),
  };

  if (data.networkType === 'evm') {
    if (!data.evmAddress) {
      throw new functions.https.HttpsError('invalid-argument', 'Evm address is required');
    }
    if (!data.evmChain) {
      throw new functions.https.HttpsError('invalid-argument', 'Evm chain is required');
    }

    const response = await Moralis.Auth.requestMessage({
      ...params,
      network: 'evm',
      address: EvmAddress.create(data.evmAddress),
      chain: EvmChain.create(data.evmChain),
    });
    return response.raw;
  }

  if (data.networkType === 'solana') {
    if (!data.solAddress) {
      throw new functions.https.HttpsError('invalid-argument', 'Solana address is required');
    }
    if (!data.solNetwork) {
      throw new functions.https.HttpsError('invalid-argument', 'Solana network is required');
    }

    const response = await Moralis.Auth.requestMessage({
      ...params,
      network: 'solana',
      address: SolAddress.create(data.solAddress),
      solNetwork: SolNetwork.create(data.solNetwork),
    });
    return response.raw;
  }

  throw new functions.https.HttpsError('invalid-argument', `Not supported network: ${data.networkType}`);
});

// ~/ext-moralis-auth-issueToken

interface IssueTokenData {
  networkType: NetworkType;
  message: string;
  signature: string;
}

export const issueToken = functions.handler.https.onCall(async (data: IssueTokenData) => {
  if (!data.message) {
    throw new functions.https.HttpsError('invalid-argument', 'Message is required');
  }
  if (!data.signature) {
    throw new functions.https.HttpsError('invalid-argument', 'Signature is required');
  }

  const params = {
    message: data.message,
    signature: data.signature,
  };

  let uid: string | null = null;
  let address: string | null = null;

  if (data.networkType === 'evm') {
    const response = await Moralis.Auth.verify({
      ...params,
      network: 'evm',
    });
    uid = response.result.profileId;
    address = response.result.address.checksum;
  }
  else if (data.networkType === 'solana') {
    const response = await Moralis.Auth.verify({
      ...params,
      network: 'solana',
    });
    uid = response.result.profileId;
    address = response.result.address.address;
  }
  else {
    throw new functions.https.HttpsError('invalid-argument', `Not supported network: ${data.networkType}`);
  }

  if (!(await userExists(auth, uid))) {
    await auth.createUser({
      uid,
      displayName: address,
    });
  }

  const token = await auth.createCustomToken(uid);
  return { token };
});
