import { deleteApp, initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import type { InjectionKey } from 'vue';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly fbApp: FirebaseApp;
  }
}

export const fbAppKey: InjectionKey<FirebaseApp> = Symbol('firebase-app-key');
export function createFbApp(name: string) {
  return initializeApp(process.env.FIREBASE_CONFIG as never, name);
}

export async function destroyFbApp(app: FirebaseApp) {
  await deleteApp(app);
}

export function useFbApp() {
  const fbApp = inject(fbAppKey);
  if (!fbApp) {
    throw 'firebase app not injected';
  }
  return fbApp;
}
