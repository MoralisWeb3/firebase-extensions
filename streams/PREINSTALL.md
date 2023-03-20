Synchronize Blockchain state with your app easily. Check [our tutorial](https://docs.moralis.io/streams-api/integrations/firebase) or [our video tutorial](https://www.youtube.com/watch?v=EieJVLhpvsI) to learn how to use this extension.

## How to Install?

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

Now you need to configure your streams in the Moralis admin panel. Check [our tutorial](https://docs.moralis.io/streams-api/integrations/firebase) or [our video tutorial](https://www.youtube.com/watch?v=EieJVLhpvsI).

## Billing

This extension uses the following services:

* Firebase Cloud Functions and Firestore, this extension requires the pay as you go plan ([pricing](https://firebase.google.com/pricing))
* [Secret Manager](https://cloud.google.com/secret-manager/) service ([pricing](https://cloud.google.com/secret-manager/pricing)) from the Google Cloud to protect a sensitive configuration of the extension
* Moralis Streams ([pricing](https://moralis.io/pricing/))

You are responsible for any costs associated with your use of these services.

## Links

* [Moralis Docs](https://docs.moralis.io/)
* [Moralis Forum](https://forum.moralis.io/)
