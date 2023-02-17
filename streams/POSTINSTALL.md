Thanks for installing the extension! Check [our tutorial](https://docs.moralis.io/streams-api/integrations/firebase) to learn how to use it. If you prefer a video tutorial, you can find it [here](https://www.youtube.com/watch?v=EieJVLhpvsI).

### Firestore Security Rules

Don't forget to add **MANDATORY** security rules to the Firestore configuration (`firestore.rules`)

This step is very important, because this extension adds new documents to specific collections bases on your subscribed streams. These collections cannot be modified by external users. To achieve that we need to set specific permissions.

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

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
