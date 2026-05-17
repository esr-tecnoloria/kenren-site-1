/**
 * Seeds (or updates) the admin users: creates Firebase Auth users if missing,
 * sets custom claims (role), and upserts the corresponding row in shared.users.
 *
 * Run: pnpm --filter @kenren/api seed:admin
 */
import 'dotenv/config';
import { firebaseAuth } from '../src/lib/firebase.js';
import { prisma } from '../src/lib/prisma.js';

const ADMINS: Array<{ email: string; displayName?: string; role: 'webmaster' | 'content_admin' }> = [
  { email: 'eduardodeabreu27@gmail.com', displayName: 'Eduardo de Abreu',  role: 'webmaster' },
  { email: 'oishi.luciana@gmail.com',    displayName: 'Luciana Oishi',     role: 'webmaster' },
  { email: 'alexandre.takashi@gmail.com',displayName: 'Alexandre Takashi', role: 'webmaster' },
];

async function ensureFirebaseUser(email: string, displayName?: string) {
  try {
    const u = await firebaseAuth.getUserByEmail(email);
    if (displayName && u.displayName !== displayName) {
      await firebaseAuth.updateUser(u.uid, { displayName });
    }
    return u;
  } catch {
    return firebaseAuth.createUser({ email, displayName, emailVerified: false });
  }
}

async function main() {
  for (const a of ADMINS) {
    const fb = await ensureFirebaseUser(a.email, a.displayName);
    await firebaseAuth.setCustomUserClaims(fb.uid, { role: a.role });
    await prisma.user.upsert({
      where: { firebaseUid: fb.uid },
      update: { email: a.email, displayName: a.displayName, role: a.role, active: true },
      create: { firebaseUid: fb.uid, email: a.email, displayName: a.displayName, role: a.role, active: true },
    });
    console.log(`✓ ${a.email}  →  uid=${fb.uid}  role=${a.role}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
