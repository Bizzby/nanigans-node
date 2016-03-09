var assert = require('assert');
var debug = require('debug')('analytics-node');
var request = require('superagent');
require('superagent-retry')(request);
var type = require('component-type');
var join = require('join-component');

/**
 * Expose a `Nanigans` client.
 */

module.exports = Nanigans;

/**
 * Initialize a new `Nanigans` with your `appId`, your `fbAppId` and an
 * optional dictionary of `options`.
 *
 * @param {String} appId
 * @param {Object} options (optional)
 *   @property {Number} flushAt (default: 20)
 *   @property {Number} flushAfter (default: 10000)
 *   @property {String} host (default: 'https://api.nanigans.com/')
 */

function Nanigans(appId, fbAppId, options){
  if (!(this instanceof Nanigans)) return new Nanigans(appId, fbAppId, options);
  assert(appId, 'You must pass your Nanigans App ID');
  options = options || {};
  this.appId = appId;
  this.fbAppId = fbAppId;
  this.host = options.host || 'https://api.nanigans.com/';
  this.retryTimes = options.retryTimes || 3;
}

/**
 * Send a track `message`.
 *
 * @param {Object} message
 * @param {string} path
 * @param {Function} fn (optional)
 * @return {Nanigans}
 */

Nanigans.prototype.track = function(message, path, fn){
  validate(message);
  assert(path, 'You must pass an "event" path [mobile.php, event.php]');

  message.app_id = this.appId;
  message.fb_app_id = this.fbAppId;

  var req = request
    .post(this.host+path)
    .retry(this.retryTimes)
    .send(message)
    .end(function(err, res){
      err = err || error(res);
      fn(err, data);
      debug('flushed: %o', data);
    });
};

/**
 * Validation rules.
 */

var rules = {
  s2s:            'number',
  type:           'string',
  name:           'string',
  user_id:        ['string', 'number'],
  sku:            ['string', 'number', 'array'],
  currency:       'string',
  advertising_id: 'string'
};

/**
 * Validate an options `obj`.
 *
 * @param {Object} obj
 */

function validate(obj){
  assert('object' == type(obj), 'You must pass a message object.');
  for (var key in rules) {
    var val = obj[key];
    if (!val) continue;
    var exp = rules[key];
    exp = ('array' === type(exp) ? exp : [exp]);
    var a = 'object' == exp ? 'an' : 'a';
    assert(exp.some(function(e){ return type(val) === e; }), '"' + key + '" must be ' + a + ' ' + join(exp, 'or') + '.');
  }
};

/**
 * Get an error from a `res`.
 *
 * @param {Object} res
 * @return {String}
 */

function error(res){
  if (!res.error) return;
  var body = res.body;
  var msg = body.error && body.error.message
    || res.status + ' ' + res.text;
  return new Error(msg);
}
