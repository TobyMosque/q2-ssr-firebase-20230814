/* eslint-disable @typescript-eslint/no-unused-vars */
import secrets from '../../secrets/firebase-admin.json';
import {
  initializeApp,
  getApp,
  deleteApp,
  cert,
  App,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export function createFbAdmin(name: string) {
  return initializeApp(
    {
      credential: cert({
        privateKey: secrets.private_key,
        clientEmail: secrets.client_email,
        projectId: secrets.project_id,
      }),
    },
    name
  );
}

export async function destroyFbAdmin(app: App) {
  await deleteApp(app);
}

export async function doFbLogin(app: App, idToken: string) {
  const expiresIn = 60 * 60 * 24 * 1000;

  const auth = await getAuth(app);
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn,
  });
  return { expiresIn, sessionCookie };
}

export async function doFbRefresh(app: App, sessionCookie: string) {
  const auth = await getAuth(app);
  const claims = await auth.verifySessionCookie(sessionCookie, true);
  const token = await auth.createCustomToken(claims.uid);
  return {
    token,
  };
}
