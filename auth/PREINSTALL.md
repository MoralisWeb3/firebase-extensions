Use this extension to allow your community of users to authenticate with Web3 wallets.

## Before Start

This extension requires a certificate of [the service account](https://firebase.google.com/support/guides/service-accounts). To generate it go to **Firebase Console** > **Your Project** > **Project Settings** > **Service Accounts** and click the **Generate new private key** button.

Your service account must have the **Service Account Token Creator** role. This extension needs it to issue [custom tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens).

During the installation process the installer will ask you about the certificate. Before you answer, you need to convert the certificate to extension variables. We created an online converter that automates this process.

*  [🛠 Open Service Account Converter](https://moralisweb3.github.io/firebase-extensions/service-account-converter/)

## Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing). This extension uses the following Firebase services:

* Cloud Functions
* Firebase Authentication

This extension also uses the following third-party services:

* Moralis Auth API ([pricing](https://moralis.io/pricing/))

You are responsible for any costs associated with your use of these services.
