/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util')
  , axios = require('axios');


/**
 * `Strategy` constructor.
 *
 * Hämeenlinna authentication strategy requests the current user details
 * from the Respa backend API using the session cookies delivered
 * from the the user's browser. Successful authentication requires
 * that the user has previously authenticated using the login form
 * at the Respa installation.
 *
 * Varaamo and Respa must be served from the same domain for this to work.
 * Session cookies are bound to a domain.
 *
 * Options:
 *   - `currentUserURL`  URL of the endpoint where the logged in user's data
 *                       will be fetched from.
 *
 *
 * @param {Object} options
 * @api public
 */
function Strategy(options) {
  this._currentUserURL = options.currentUserURL;

  passport.Strategy.call(this);
  this.name = 'hameenlinna';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request by getting the current logged in user from the backend.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};

  var self = this;
  var headers = {
    Cookie: req.headers.cookie || ""
  }
  axios.request({
    url: self._currentUserURL,
    method: "get",
    headers: headers
  }).then((response) => {
    let user = {
      id: response.data.uuid,
      token: "session"
    }
    self.success(user, {});
  }).catch((error) => {
    self.error(error);
  });

};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
