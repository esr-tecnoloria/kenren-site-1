import { Storage } from '@google-cloud/storage';
import { env } from './env.js';

export const storage = new Storage({ projectId: env.FIREBASE_PROJECT_ID });
export const bucket = storage.bucket(env.GCS_BUCKET);

export async function signUploadUrl(opts: {
  path: string;
  contentType: string;
  expiresInMinutes?: number;
}) {
  const [url] = await bucket.file(opts.path).getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + (opts.expiresInMinutes ?? 5) * 60 * 1000,
    contentType: opts.contentType,
  });
  return url;
}

export async function signReadUrl(path: string, expiresInMinutes = 60) {
  const [url] = await bucket.file(path).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });
  return url;
}
