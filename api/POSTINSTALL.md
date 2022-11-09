### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

### Firestore Security Rules

Don't forget to add security rules to the Firestore configuration (`firestore.rules`).

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
