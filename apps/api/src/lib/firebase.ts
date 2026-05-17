import { existsSync } from 'node:fs';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from './env.js';

function init() {
  if (getApps().length > 0) return;

  const credPath = env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && existsSync(credPath)) {
    initializeApp({
      credential: cert(credPath),
      projectId: env.FIREBASE_PROJECT_ID,
    });
  } else {
    initializeApp({
      credential: applicationDefault(),
      projectId: env.FIREBASE_PROJECT_ID,
    });
  }
}

init();

export const firebaseAuth = getAuth();
