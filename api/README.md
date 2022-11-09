# Moralis Web3 API for Front-End Applications

Call Moralis API from the front-end application easily.

### How to Install?

Using the Firebase CLI:

**Step 1**: Add the extension to your project: `firebase ext:install moralis/moralis-api --local --project=<PROJECT_ID_OR_ALIAS>`

**Step 2**: Add security rules to the Firestore configuration (`firestore.rules`).

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /moralisApiRateLimiter {
      allow read: if false;
      allow write: if false;
    }
  }
} 
```

Before deploying your project, be sure that you set permissions correctly. You may use for that the [Rules Playground](https://firebase.google.com/docs/rules/simulator). Go to: `Firebase Console` > `Your Project` > `Firestore Database` > `Rules` > `Edit Rules` and click the `Rules Playground` tab.

**Step 3 (Optional)**: Test this extension locally: `firebase emulators:start`

**Step 4**: Deploy this extension: `firebase deploy --only extensions --project=<PROJECT_ID_OR_ALIAS>`
