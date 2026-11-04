# Sales Track — Firebase multi-device setup

This build uses Firebase Authentication (email/password) and Cloud Firestore. Each business has a separate workspace. Do not use real customer data until the rules below are published and tested.

## 1. Create the Firebase project and web app

1. Open https://console.firebase.google.com/ and create a project.
2. In Project settings → Your apps, register a Web app named `Sales Track Web`.
3. Copy the web configuration values.
4. Edit `firebase-config.js` and replace every placeholder with the values from Firebase. The Firebase Web App config (including its apiKey) is designed to be present in a client app; it is not a private server credential. Never put a service-account JSON file, private key, or admin SDK credential in this repository.

## 2. Enable sign-in

Firebase Console → Authentication → Get started → Sign-in method → Email/Password → Enable → Save.

## 3. Create Firestore

Firebase Console → Firestore Database → Create database. Start in production mode. Choose a region close to the business where available.

## 4. Publish security rules

Open Firestore → Rules, replace the editor contents with `firestore.rules`, then Publish. Never use `allow read, write: if true` or test-mode public rules.

The rules enforce:
- Only signed-in users who have an active workspace membership can read/write business records.
- Only an Administrator can access or change the `users` records and manage memberships.
- The first account can create the workspace and its own Administrator membership together.

## 5. Create the first business workspace

1. Deploy the site over HTTPS (Vercel is fine).
2. Open it and enter the administrator email, a password of at least 8 characters, and full name.
3. Tap **Create new business workspace**.
4. Save the workspace ID displayed. The ID is needed when signing in on other devices.

## 6. Add staff accounts (manual first version)

For each staff member:
1. In Firebase Console → Authentication → Users, add the employee using their email and a temporary password. Give the password to the employee securely and have them change it after first sign-in (password reset can be done through Firebase Authentication).
2. Copy the employee's Firebase UID.
3. In Firestore, open `teams/{WORKSPACE_ID}/members` and create a document whose document ID is that UID.
4. Add fields: `uid` (string, same UID), `email` (string), `name` (string), `role` (string: `Employee` or `Administrator`), `active` (boolean: `true`), `createdAt` (timestamp).
5. The employee signs into Sales Track using their email/password and the workspace ID.

Only grant Administrator to people who should manage the business. Membership changes in the Firebase console are administrator-controlled. In-app invitations and role management are a later milestone.

## 7. Connect another device

Open the same HTTPS Vercel URL, enter the employee's Firebase email/password and the same workspace ID, then sign in. Sales, stock, expenses, ledger and audit records sync through Firestore. Browser local storage is a local cache; Firestore is the shared source once connected.

## Important limitations in this build

- This is an early multi-device implementation. Test with dummy data and two devices before relying on it for trading.
- Employee provisioning is manual in Firebase Console; the in-app user registration screen is disabled for cloud accounts.
- The existing local backup/import feature remains available. Keep regular backups.
- Offline edits are not yet queued with a full conflict-resolution strategy. Avoid editing the same record simultaneously on multiple devices.
- Deletion synchronisation is basic; verify deletes and restores during testing.
- Firebase Authentication and rules protect the cloud boundary, but app-side business workflows and all permission paths still need a security review before production use.
- Use strong unique passwords, enable account recovery, and restrict Firebase project console access.
