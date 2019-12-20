'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeGcm = require('node-gcm');

var _nodeGcm2 = _interopRequireDefault(_nodeGcm);

var _BaseNotification2 = require('./BaseNotification');

var _BaseNotification3 = _interopRequireDefault(_BaseNotification2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GCMNotification = function (_BaseNotification) {
  _inherits(GCMNotification, _BaseNotification);

  function GCMNotification(config) {
    _classCallCheck(this, GCMNotification);

    var _this = _possibleConstructorReturn(this, (GCMNotification.__proto__ || Object.getPrototypeOf(GCMNotification)).call(this, config));

    _this.setProvider(new _nodeGcm2.default.Sender(_this.get('provider.apiKey'), _this.get('provider')));
    return _this;
  }

  /**
   * Create new message object
   * @param {Object} [_notification] Notification object
   * @param {Object} [_config] Additional configuration object
   * @private
   */


  _createClass(GCMNotification, [{
    key: 'createNotification',
    value: function createNotification(_notification, _config) {
      var predefinedNotification = this.get('notification') || {};
      var customNotification = _notification || {};
      var config = _lodash2.default.merge({
        data: customNotification.payload || predefinedNotification.payload || {},
        notification: {
          title: customNotification.title || predefinedNotification.title,
          body: customNotification.body || predefinedNotification.body,
          icon: customNotification.icon || predefinedNotification.icon,
          sound: customNotification.sound || predefinedNotification.sound,
          badge: customNotification.badge || predefinedNotification.badge
        }
      }, _config);

      return new _nodeGcm2.default.Message(config);
    }

    /**
     * Send notification to device
     * @param {Array} [_device] Array with device tokens or string with token
     * @param {Object} [_notification] Notification configuration object
     * @param {Object} [_config] Additional configuration for notification
     * @returns {Promise}
     * APNNotification.send('DEVICE', {
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
      var _this2 = this;

      var device = [].concat(this.get('device') || []).concat(_device || []);
      var message = this.createNotification(_notification, _config);

      return new Promise(function (resolve, reject) {
        _this2.getProvider().send(message, device, function (error, result) {
          return error ? reject(error) : resolve(result);
        });
      });
    }
  }]);

  return GCMNotification;
}(_BaseNotification3.default);

exports.default = GCMNotification;
module.exports = exports.default;