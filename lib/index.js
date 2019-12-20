'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (type, config) {
  if (pusher[type.toLowerCase()] instanceof Function) {
    return new pusher[type.toLowerCase()](config);
  } else {
    throw new Error('Unrecognized type -> ' + type);
  }
};

var _APNNotification = require('./APNNotification');

var _APNNotification2 = _interopRequireDefault(_APNNotification);

var _GCMNotification = require('./GCMNotification');

var _GCMNotification2 = _interopRequireDefault(_GCMNotification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pusher = {
  ios: _APNNotification2.default,
  android: _GCMNotification2.default
};

/**
 * Create instance of Pusher service
 * @param {String} type
 * @param {Object} [config]
 * @returns {*}
 */
module.exports = exports.default;