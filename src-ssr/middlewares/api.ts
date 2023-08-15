import { ssrMiddleware } from 'quasar/wrappers';
import helmet from 'helmet';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import {
  doFbRefresh,
  doFbLogin,
  createFbAdmin,
} from 'src/composables/firebase-admin';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/developing-ssr/ssr-middlewares
export default ssrMiddleware(async ({ app }) => {
  app.use(json());
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            'https://apis.google.com/',
          ],
          'connect-src': ["'self'", 'https://identitytoolkit.googleapis.com/'],
          'frame-src': ['https://q2-ssr-test.firebaseapp.com/'],
        },
      },
    })
  );

  const fbApp = createFbAdmin('admin');
  app.post('/api/login', async (req, res) => {
    // Set session expiration to 1 days.

    const idToken = req.body.idToken.toString();
    const { sessionCookie, expiresIn } = await doFbLogin(fbApp, idToken);
    res.cookie('session', sessionCookie, {
      maxAge: expiresIn,
      sameSite: 'lax',
      httpOnly: true,
      secure: true,
      path: '/',
    });
    res.json({ status: 'success' });
  });

  app.get('/api/refresh', async (req, res) => {
    const sessionCookie = req.cookies.session || '';
    if (sessionCookie) {
      const profile = await doFbRefresh(fbApp, sessionCookie);
      res.json(profile);
    } else {
      res.json({});
    }
  });

  app.delete('/api/logout', async (req, res) => {
    res.clearCookie('session');
    res.json({});
  });
});
