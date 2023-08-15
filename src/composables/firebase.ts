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
  return initializeApp(
    {
      apiKey: 'AIzaSyAr6R6FVxe7lPWQlgWTJDO207TKjaFX6jM',
      authDomain: 'q2-ssr-test.firebaseapp.com',
      projectId: 'q2-ssr-test',
      storageBucket: 'q2-ssr-test.appspot.com',
      messagingSenderId: '912082309223',
      appId: '1:912082309223:web:a46dd58a3880444216c4c2',
      measurementId: 'G-35SLQK1LLJ',
    },
    name
  );
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
