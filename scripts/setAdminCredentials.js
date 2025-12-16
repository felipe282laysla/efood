#!/usr/bin/env node
// Usage:
// node scripts/setAdminCredentials.js --email admin@example.com --password secret --key ./serviceAccountKey.json
// Or set GOOGLE_APPLICATION_CREDENTIALS env var to the path of the service account key JSON

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = {};
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = raw[i + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
}

(async () => {
  const args = parseArgs();
  const email = args.email;
  const password = args.password;
  const keyPath = args.key || process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!email || !password) {
    console.error('\nUsage: node scripts/setAdminCredentials.js --email admin@example.com --password secret [--key /path/to/serviceAccountKey.json]\n');
    process.exit(1);
  }

  if (!keyPath) {
    console.error('\nService account key required. Provide via --key /path/to/key.json or set GOOGLE_APPLICATION_CREDENTIALS env var.\n');
    process.exit(1);
  }

  try {
    const admin = require('firebase-admin');
    const absKey = path.isAbsolute(keyPath) ? keyPath : path.resolve(process.cwd(), keyPath);
    if (!fs.existsSync(absKey)) {
      console.error(`Service account key not found at ${absKey}`);
      process.exit(1);
    }

    const serviceAccount = require(absKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    const coll = db.collection('adminCredentials');
    const snapshot = await coll.limit(1).get();

    if (!snapshot.empty) {
      const ref = snapshot.docs[0].ref;
      await ref.update({ email, password });
      console.log('Admin credentials updated successfully.');
    } else {
      await coll.add({ email, password });
      console.log('Admin credentials created successfully.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error updating admin credentials:', err);
    process.exit(1);
  }
})();
