# Sales Track

A general-purpose sales, inventory, expense, customer-ledger and reporting PWA with Firebase email/password authentication and shared Firestore workspace synchronisation.

## Files

- `index.html` — application.
- `firebase-config.js` — Firebase web configuration placeholder; replace before deployment.
- `firebase-config.example.js` — template.
- `firestore.rules` — security rules to publish in Firebase.
- `FIREBASE_SETUP.md` — setup, first workspace, staff membership and deployment instructions.
- `manifest.webmanifest`, `service-worker.js`, `icon-192.png`, `icon-512.png` — installable PWA support.
- `vercel.json` — Vercel headers.

## Deploy

Upload the contents of this folder to the root of a GitHub repository and import it into Vercel. Use no build command and no output directory override. Before deployment, edit `firebase-config.js` with your Firebase Web App config. The web config is public client configuration; never commit Firebase service-account credentials or private keys.

## Important

Follow `FIREBASE_SETUP.md` in order. Enable Email/Password Authentication, create Firestore, and publish `firestore.rules` before creating the first workspace. This is an early multi-device release: test with dummy records on two devices, keep backups, and avoid simultaneous edits to the same record. Staff account provisioning is manual in Firebase Console in this version.
