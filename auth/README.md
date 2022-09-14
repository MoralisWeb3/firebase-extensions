# Moralis Auth Firebase Extension

Signs in the using Moralis Auth as the identity provider.

### How to Install?

Using the Firebase CLI:

**Step 1**: Before you start, you need to generate a certificate for the Service Account. This extension requires the service account for issuing authorization tokens. To generate the certificate go to: `Firebase Console` > `Your Project` > `Project Settings` > `Service Accounts` and click the `Generate new private key` button.

**Step 2**: Add the extension to your project: `firebase ext:install moralis/auth --local --project=<PROJECT_ID>`

**Step 3**: During the installation process, you will be asked for some information. Some of them would be questions about the service account. The extension needs some data from your certificate. We create the converter that extracts this information: [open the converter](https://moralisweb3.github.io/firebase-extensions/service-account-converter/), put your certificate in the text field and copy a variable value as an answer for a specific question in your console.

**Step 4**: Test this extension locally: `firebase emulators:start`
