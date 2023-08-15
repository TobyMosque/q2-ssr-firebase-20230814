import { defineStore } from 'pinia';
import { useAuth as useFbAuth } from '@vueuse/firebase/useAuth';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as _signOut,
  signInWithCustomToken,
  getAuth,
  inMemoryPersistence,
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', () => {
  const { fbApp, api } = useDiStore();

  const auth = getAuth(fbApp);
  auth.setPersistence(inMemoryPersistence);

  const fbAuth = useFbAuth(auth);
  const user = computed(() => fbAuth.user.value);
  const isAuthenticated = computed(() => fbAuth.isAuthenticated.value);

  async function setToken(token: string) {
    await signInWithCustomToken(auth, token);
  }

  async function updateToken() {
    const { data } = await api.get('/refresh');
    if (data?.token) {
      await setToken(data?.token);
    }
  }

  async function signIn() {
    await signInWithPopup(auth, new GoogleAuthProvider());
    await new Promise((resolve) => setTimeout(resolve, 1));
    if (user.value) {
      const idToken = await user.value.getIdToken();
      await api.post('/login', { idToken });
      await updateToken();
    }
  }

  async function signOut() {
    await _signOut(auth);
    await api.delete('/logout');
  }

  return {
    isAuthenticated,
    user,
    signIn,
    signOut,
    updateToken,
    setToken,
  };
});
