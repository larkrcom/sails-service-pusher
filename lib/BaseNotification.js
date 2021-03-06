'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseNotification = function () {
  function BaseNotification(_config) {
    _classCallCheck(this, BaseNotification);

    this._config = {};
    this._provider = {};

    _lodash2.default.assign(this._config, _config);
  }

  /**
   * Get configuration value
   * @param {String} [path]
   * @returns {*}
   */


  _createClass(BaseNotification, [{
    key: 'get',
    value: function get(path) {
      return typeof path === 'undefined' ? this._config : _lodash2.default.get(this._config, path);
    }

    /**
     * Set configuration value
     * @param {String} path
     * @param {*} value
     * @returns {BaseNotification}
     */

  }, {
    key: 'set',
    value: function set(path, value) {
      _lodash2.default.set(this._config, path, value);
      return this;
    }

    /**
     * Get provider for sending notifications
     * @returns {*}
     */

  }, {
    key: 'getProvider',
    value: function getProvider() {
      return this._provider;
    }

    /**
     * Set new provider to this pusher
     * @param {*} provider
     * @returns {BaseNotification}
     */

  }, {
    key: 'setProvider',
    value: function setProvider(provider) {
      this._provider = provider;
      return this;
    }
  }]);

  return BaseNotification;
}();

exports.default = BaseNotification;
module.exports = exports.default;