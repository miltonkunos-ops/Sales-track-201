# Sales Track

A general-purpose sales, inventory, expenses, customer-ledger and business-tracking progressive web app (PWA).

## Repository contents

- `index.html` — Sales Track application.
- `manifest.webmanifest` — installable-app metadata.
- `service-worker.js` — caches the app shell for offline launch.
- `icon-192.png`, `icon-512.png` — application icons.
- `vercel.json` — static deployment headers for Vercel.

## Run locally

This is a static web app; no Node.js build step is required. Serve this directory using a local HTTP server, or deploy it to an HTTPS host. Opening `index.html` directly with `file://` will not enable PWA installation or service-worker caching.

## Deploy with GitHub and Vercel

1. Create a new **public or private** repository on GitHub named `sales-track`.
2. Upload the contents of this folder to the repository root (the files should be directly visible, especially `index.html` and `vercel.json`).
3. In Vercel, choose **Add New → Project**, import the `sales-track` GitHub repository, and deploy it.
4. Use the defaults for a static site: no framework preset, no build command, and no output directory override. The repository root is the site root.
5. Open the HTTPS deployment URL in Chrome on Android. Use Chrome's menu and choose **Install app** or **Add to Home screen**.

Every push to the connected GitHub branch can trigger a new Vercel deployment.

## Current development status — Build 1

This is an installation-ready PWA foundation, not yet a production-ready multi-device business system.

- Business records are currently stored locally in the browser/device.
- The app's current username/password and role checks are browser-side only and must not be treated as secure authentication.
- Firebase live sync is disabled by default in this build. The existing dormant Firestore code is not ready for real customer or business data.
- Do not enable public Firestore read/write rules.
- Firebase Authentication, workspace membership, server-enforced Firestore Security Rules, and safe synchronisation for creates, updates and deletes must be implemented and tested before using shared cloud data.
- Backups may contain business records and user data. Store backup files securely and do not share them publicly.

## Security notes

Never commit passwords, private keys, Firebase service-account JSON files, or other secrets. A Firebase web configuration is not itself a server secret, but database access must still be protected with Authentication and restrictive Firestore Security Rules.

## Next milestone

Implement individual email/password sign-in, administrator-created workspace membership, role permissions enforced by Firestore Security Rules, and conflict-aware multi-device data synchronisation.
