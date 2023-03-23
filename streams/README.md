# Stream Blockchain Events to Firestore

Use this extension as your backend to get notified about Web3 events automatically with [Moralis Stream](https://moralis.io/streams/).

Receive instant, customizable updates when something important happens on-chain. We support all types of events, NFTs, DeFi, DAO, smart contracts, wallets, and more.

**Get user asset transfers in real-time:**

Monitor your users' transactions and balances with ease. Stream any on-chain event, including tokens, NFTs, and DeFi transactions, directly into your backend.

![Get user asset transfers in real-time](https://raw.githubusercontent.com/MoralisWeb3/firebase-extensions/feat/new-description/streams/.github/real-time-transfer.png)

**Notify users automatically about Web3 events:**

Maximize user engagement with real-time notifications. Stay ahead of the competition with seamless real-time updates and notifications for your user or wallet. Set filters to monitor relevant on-chain events; from your users' holdings to the latest token, NFT, and DeFi contracts events.

![Notify users automatically about Web3 events](https://raw.githubusercontent.com/MoralisWeb3/firebase-extensions/feat/new-description/streams/.github/web3-event-notification.png)

**The fastest way to get your smart contract events:**

Track specific contracts and on-chain events with ease. Simply input the contracts you're interested in, add your ABI, and setup custom data filter on topics and metadata to receive the events, addresses, interactions, and internal transactions you need.

### How to Install?

Using the Firebase CLI:

**Step 1**: Add the extension to your project: `firebase ext:install moralis/moralis-streams --local --project=<PROJECT_ID_OR_ALIAS>`

**Step 2** 🚨: Add **MANDATORY** security rules to the Firestore configuration (`firestore.rules`). This step is very important, because this extension adds new documents to specific collections bases on your subscribed streams. These collections cannot be modified by external users. To achieve that we need to set specific permissions.

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /moralis/{collectionType}/{collectionName}/{id} {
      allow read;
      allow write: if false;
    }
  }
}
```

Before deploying your project, be sure that you set permissions correctly. You may use for that the [Rules Playground](https://firebase.google.com/docs/rules/simulator). Go to: `Firebase Console` > `Your Project` > `Firestore Database` > `Rules` > `Edit Rules` and click the `Rules Playground` tab.

**Step 3 (Optional)**: Test this extension locally: `firebase emulators:start`

**Step 4**: Deploy this extension: `firebase deploy --only extensions --project=<PROJECT_ID_OR_ALIAS>`

## How do I setup a stream? 

Setup Moralis Stream using:
* [Moralis SDK - Documentation](https://docs.moralis.io/streams-api/evm/using-node-js-sdk)
* [No-code solution - Documentation](https://docs.moralis.io/streams-api/evm/using-webui)

## Webhook URL of Deployed Dapp

Go to: `Firebase Console` > `Build` > `Functions` and find a function called `ext-moralis-streams-webhook`. The URL should have the following format:

```
https://<location>-<project_id>.cloudfunctions.net/ext-moralis-streams-webhook
```

Check [our documentation](https://docs.moralis.io/streams-api/evm/integrations/firebase#webhook-url-of-deployed-dapp).

## Handling Streams by Cloud Functions 

For cloud functions, we need to create functions that are called when any item in the collection is changed. For that, we will use the `onWrite` trigger:

```ts
import * as functions from "firebase-functions";

const collectionName = "LoremIpsum";

export const onItemWrite = functions.firestore
  .document(`moralis/txs/${collectionName}/{id}`)
  .onWrite(async (change) => {
    const transaction = change.after.data();

    if (transaction && transaction.confirmed) {
      doSomeOperation(/* ... */);
    }
  });
```

Check [our documentation](https://docs.moralis.io/streams-api/evm/integrations/firebase#handling-streams).

## Handling Streams on the Frontend

For the frontend dapp, we will use the `onSnapshot` method:

```ts
const db = firebase.firestore();
const collectionName = "LoremIpsum";

db.collection(`moralis/txs/${collectionName}`).onSnapshot((change) => {
  doSomeOperation(change.docs);
});
```

## Demo Project

You can find the repository with the final code here: [firebase-streams-ext](https://github.com/MoralisWeb3/Moralis-JS-SDK/tree/main/demos/firebase-streams-ext).

## Billing

This extension uses the following services:

* Firebase Cloud Functions and Firestore, this extension requires the pay as you go plan ([pricing](https://firebase.google.com/pricing))
* [Secret Manager](https://cloud.google.com/secret-manager/) service ([pricing](https://cloud.google.com/secret-manager/pricing)) from the Google Cloud to protect a sensitive configuration of the extension
* Moralis Streams ([pricing](https://moralis.io/pricing/))

You are responsible for any costs associated with your use of these services.
