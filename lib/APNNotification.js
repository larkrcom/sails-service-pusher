'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _apn = require('apn');

var _apn2 = _interopRequireDefault(_apn);

var _BaseNotification2 = require('./BaseNotification');

var _BaseNotification3 = _interopRequireDefault(_BaseNotification2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default stderr
 * @type {Function}
 * @private
 */
var DEFAULT_STDERR = console.error.bind(console);

var APNNotification = function (_BaseNotification) {
  _inherits(APNNotification, _BaseNotification);

  function APNNotification(config) {
    _classCallCheck(this, APNNotification);

    var _this = _possibleConstructorReturn(this, (APNNotification.__proto__ || Object.getPrototypeOf(APNNotification)).call(this, config));

    _this.setProvider(new _apn2.default.Provider(_this.get('provider')));

    _this.getProvider().on('error', _this.get('stderr') || DEFAULT_STDERR).on('transmissionError', _this.get('stderr') || DEFAULT_STDERR);
    return _this;
  }

  /**
   * Create apn notification
   * @param {Object} _notification Configuration for the notification
   * @param {Object} _config Additional configuration for the notification object
   * @returns {Notification}
   * @private
   */


  _createClass(APNNotification, [{
    key: 'createNotification',
    value: function createNotification(_notification, _config) {
      var predefinedNotification = this.get('notification') || {};
      var customNotification = _notification || {};
      var notification = new _apn2.default.Notification(customNotification.payload || predefinedNotification.payload || {});

      notification.sound = customNotification.sound || predefinedNotification.sound;
      notification.badge = customNotification.badge || predefinedNotification.badge;
      notification.title = customNotification.title || predefinedNotification.title;
      notification.alert = customNotification.body || predefinedNotification.body;
      notification.payload = customNotification.payload || predefinedNotification.payload;
      notification.topic = this._config.provider.topic;

      var note = _lodash2.default.merge(notification, _config);
      console.log(note);
      return note;
    }

    /**
     * Send push notification for one of devices
     * @param {Device} _device Device object
     * @param {Notification} _notification Notification object
     * @returns {APNNotification}
     * @private
     */

  }, {
    key: 'sendToDevice',
    value: function sendToDevice(_device, _notification) {
      this.getProvider().send(_notification, _device);
      return this;
    }

    /**
     * Send push notification to devices
     * @param {Array} [_device] Device tokens in array of string or string
     * @param {Object} [_notification] Notification configuration
     * @param {Object} [_config] Additional configuration for notification
     * @returns {APNNotification}
     * @example
     * APNNotification.send(['DEVICE'], {
     *  title: 'Notification title',
     *  body: 'Notification body text',
     *  icon: 'Drawable resource',
     *  sound: 'Sound to be played',
     *  badge: 'The badge on client app',
     *  payload: {}
     * });
     */

  }, {
    key: 'send',
    value: function send(_device, _notification, _config) {
      var device = [].concat(this.get('device') || []).concat(_device || []);
      var notification = this.createNotification(_notification, _config);

      for (var i = 0; i < device.length; i++) {
        this.sendToDevice(device[i], notification);
      }

      return Promise.resolve();
    }
  }]);

  return APNNotification;
}(_BaseNotification3.default);

exports.default = APNNotification;
module.exports = exports.default;