import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import nocache from 'nocache';

import configurePassport from './configureHmlPassport';
import getAuthState from './getAuthState';

const router = express.Router();  // eslint-disable-line new-cap
const passport = configurePassport();
const maxSessionAge = 9 * 60 * 60 * 1000;  // 9 hours

// Session handling
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  maxAge: maxSessionAge,
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

router.get('/auth', nocache(), (req, res) => {
  res.json(getAuthState(req));
});

router.get('/login',
  (req, res) => {
    req.session.next = req.query.next; // eslint-disable-line no-param-reassign
    res.redirect('/accounts/login/?next=/varaamo/login/hameenlinna');
  }
);

router.get('/login/helsinki/return',
  passport.authenticate('helsinki', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.session.next) {
      const redirectUrl = req.session.next;
      req.session.next = null; // eslint-disable-line no-param-reassign
      res.redirect(redirectUrl);
    } else {
      res.redirect('/');
    }
  });

router.get('/login/hameenlinna',
  passport.authenticate('hameenlinna'),
  (req, res) => {
    res.redirect('/varaamo/');
  }
);

router.get('/logout', (req, res) => {
  req.logOut();
  const redirectUrl = req.query.next || '/varaamo/';
  res.redirect(`https://varaukset.hameenlinna.fi/accounts/logout/?next=${redirectUrl}`);
});

export default router;
