// Simple script to ensure required VITE_FIREBASE_* env vars are set.
const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('\nERROR: Missing Firebase environment variables:\n');
  missing.forEach((k) => console.error(`  - ${k}`));
  console.error('\nCreate a `.env` file with these variables (for local dev) or configure them in your deploy provider (Netlify).');
  console.error('\nTip: copy `.env.example` to `.env` and fill the values.\n');
  process.exit(1);
}

console.log('All required Firebase environment variables are present.');
