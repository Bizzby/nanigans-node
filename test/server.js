var express = require('express');
var httpProxy = require('http-proxy');
var http = require('http');
var debug = require('debug')('analytics-node:server')
var ports = exports.ports = { source: 4063, proxy: 4064 };

/**
 * Proxy.
 */

var proxy = httpProxy.createProxyServer();

exports.proxy = http.createServer(function(req, res) {
  proxy.web(req, res, { target: 'http://localhost:' + ports.source });
});

proxy.on('proxyRes', function (proxyRes, req, res) {
  proxyRes.statusCode = 408;
});

/**
 * App.
 */

exports.app = express()
  .use(express.bodyParser())

/**
 * Fixture.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Funtion} next
 */

exports.fixture = function(req, res, next){
  if (!req.body) {
    return res.json(400, { error: { message: 'error' }});
  }
  res.json(200);
}
