import _ from 'lodash';
import apn from 'apn';
import BaseNotification from './BaseNotification';

/**
 * Default stderr
 * @type {Function}
 * @private
 */
const DEFAULT_STDERR = console.error.bind(console);

export default class APNNotification extends BaseNotification {
  constructor(config) {
    super(config);

    this.setProvider(new apn.Provider(this.get('provider')));

    this
      .getProvider()
      .on('error', this.get('stderr') || DEFAULT_STDERR)
      .on('transmissionError', this.get('stderr') || DEFAULT_STDERR);
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
    let notification = new apn.Notification(customNotification.payload || predefinedNotification.payload || {});

    notification.sound = customNotification.sound || predefinedNotification.sound;
    notification.badge = customNotification.badge || predefinedNotification.badge;
    notification.title = customNotification.title || predefinedNotification.title;
    notification.alert = customNotification.body || predefinedNotification.body;
    notification.payload = customNotification.payload || predefinedNotification.payload;
    notification.topic = this._config.provider.topic;

    return _.merge(notification, _config);
  }

  /**
   * Send push notification for one of devices
   * @param {Device} _device Device object
   * @param {Notification} _notification Notification object
   * @returns {APNNotification}
   * @private
   */
  sendToDevice(_device, _notification) {
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
  send(_device, _notification, _config) {
    let device = [].concat(this.get('device') || []).concat(_device || []);
    let notification = this.createNotification(_notification, _config);

    for (let i = 0; i < device.length; i++) {
      this.sendToDevice(device[i], notification);
    }

    return Promise.resolve();
  }
}
