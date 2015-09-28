import _ from 'lodash';
import apn from 'apn';
import BaseNotification from './BaseNotification';

/**
 * Default stderr
 * @type {Function}
 */
const DEFAULT_STDERR = console.error.bind(console);

export default class APNNotification extends BaseNotification {
  constructor(...args) {
    super(...args);

    this.setProvider(new apn.Connection(this.get('provider')));

    this
      .getProvider()
      .on('error', this.get('stderr') || DEFAULT_STDERR)
      .on('transmissionError', this.get('stderr') || DEFAULT_STDERR);
  }

  /**
   * Create apn device with specified token
   * @param {String} token Device token
   * @returns {Device}
   * @private
   */
  createDevice(_token) {
    return new apn.Device(_token);
  }

  /**
   * Create apn notification
   * @param {Object} _notification Configuration for the notification
   * @param {Object} _config Additional configuration for the notification object
   * @returns {Notification}
   * @private
   */
  createNotification(_notification, _config) {
    let predefinedNotification = this.get('notification') || {};
    let customNotification = _notification || {};
    let notification = new apn.Notification({
      aps: {
        alert: {
          title: customNotification.title || predefinedNotification.title,
          body: customNotification.body || predefinedNotification.body
        },
        sound: customNotification.sound || predefinedNotification.sound,
        badge: customNotification.badge || predefinedNotification.badge
      },
      payload: customNotification.payload || predefinedNotification.payload || {}
    });

    return _.assign(notification, _config);
  }

  /**
   * Send push notification for one of devices
   * @param {Device} device Device object
   * @param {Notification} notification Notification object
   * @returns {APNNotification}
   * @private
   */
  sendToDevice(_device, _notification) {
    this.getProvider().pushNotification(_notification, _device);
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
  send(_device, _notification, _config) {
    let device = [].concat(this.get('device') || []).concat(_device || []);
    let notification = this.createNotification(_notification, _config);

    for (let i = 0; i < device.length; i++) {
      this.sendToDevice(this.createDevice(device[i]), notification);
    }

    return Promise.resolve();
  }
}