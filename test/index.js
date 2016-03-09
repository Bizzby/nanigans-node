var assert = require('assert');
var Nanigans = require('..');
var server = require('./server');

var a;

describe('Nanigans', function(){
  before(function(done){
    server.app
      .post('mobile.php', server.fixture)
      .post('event.php', server.fixture)
      .listen(server.ports.source, done);
  });

  beforeEach(function(){
    a = Nanigans('key', 'fbAppId', {
      host: 'http://localhost:4063'
    });
  });

  it('should expose a constructor', function(){
    assert.equal('function', typeof Nanigans);
  });

  it('should require a write key', function(){
    assert.throws(Nanigans, error("You must pass your Nanigans App ID"));
  });

  it('should not require the new keyword', function(){
    assert(a instanceof Nanigans);
  });

  it('should set default options', function(){
    var a = Nanigans('key', 'fbAppId');
    assert.equal(a.appId, 'key');
    assert.equal(a.host, 'https://api.nanigans.com/');
  });

  it('should take options', function(){
    var a = Nanigans('key', 'fbAppId', {
      host: 'a'
    });
    assert.equal(a.appId, 'key');
    assert.equal(a.fbAppId, 'fbAppId');
    assert.equal(a.host, 'a');
  });

});

/**
 * Assert an error with `message` is thrown.
 *
 * @param {String} message
 * @return {Function}
 */

function error(message){
  return function(err){
    return err.message == message;
  };
}
