import passport from 'passport';
import Strategy from './hameenlinnaStrategy';

function configurePassport() {
  const hameenlinnaStrategy = new Strategy(
    {
      currentUserURL: process.env.LOGIN_CURRENT_USER_URL || 'https://varaukset.hameenlinna.fi/v1/user/current',
    }
  );

  passport.use(hameenlinnaStrategy);

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  return passport;
}

export default configurePassport;
