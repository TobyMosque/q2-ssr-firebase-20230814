import { boot } from 'quasar/wrappers';
import { uid } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, store, ssrContext }) => {
  const uuid = uid();

  const fbApp = createFbApp(uuid);

  app.provide(fbAppKey, fbApp);
  store.use(() => ({ fbApp }));

  if (process.env.SERVER) {
    ssrContext?.onRendered(() => {
      destroyFbApp(fbApp);
    });
  }
});
