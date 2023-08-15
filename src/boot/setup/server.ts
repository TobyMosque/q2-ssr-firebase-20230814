import { boot } from 'quasar/wrappers';
import { Cookies, uid } from 'quasar';
import {
  doFbRefresh,
  destroyFbAdmin,
  createFbAdmin,
} from 'src/composables/firebase-admin';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ store, ssrContext }) => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;
  const sessionCookie = cookies.get('session');

  if (sessionCookie) {
    const name = uid();
    const fbApp = createFbAdmin(name);
    const { token } = await doFbRefresh(fbApp, sessionCookie);
    const authStore = useAuthStore(store);
    await authStore.setToken(token);
    await new Promise((resolve) => setTimeout(resolve, 1));

    ssrContext?.onRendered(() => {
      destroyFbAdmin(fbApp);
    });
  }
});
