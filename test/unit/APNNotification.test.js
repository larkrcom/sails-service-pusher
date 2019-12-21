import { assert } from 'chai';
import sinon from 'sinon';
import APNNotification from '../../src/APNNotification';

var path_cert = require('path').resolve("." + '/aws/', 'voip_development.pem');
var path_key = require('path').resolve("." + '/aws/', 'voip_development.pem');

const CONFIG = {
  device: ['a1'],
  provider: {
    cert: path_cert,
    key: path_key,
    production: false
  },
  notification: {
    title: 'TITLE',
    body: 'BODY',
    icon: 'ICON',
    sound: 'SOUND',
    badge: 'BADGE',
    payload: {
      foo: 'bar',
      bar: 'foo'
    }
  }
};

const NOTIFICATION_SHOULD_BE = {
  encoding: 'utf8',
  payload: {foo: 'bar', bar: 'foo'},
  expiry: 0,
  priority: 10,
  retryLimit: -1,
  device: undefined,
  compiled: false,
  truncateAtWordEnd: false,
  _sound: 'SOUND',
  _alert: {title: 'TITLE', body: 'BODY'}
};

describe('APNNotification', () => {
  it('Should properly export', () => {
    assert.isFunction(APNNotification);
  });

  it('Should properly send notification with pre-defined options', done => {
    let ios = new APNNotification(CONFIG);

    sinon.stub(ios.getProvider(), 'send');

    ios
      .send(['b2', 'c3'])
      .then(() => {
        assert.ok(ios.getProvider().send.calledThrice);
        assert.deepEqual(ios.getProvider().send.getCall(0).args[0].payload, {foo: 'bar', bar: 'foo'});
        assert.deepEqual(ios.getProvider().send.getCall(0).args[0]._sound, 'SOUND');
        assert.deepEqual(ios.getProvider().send.getCall(0).args[0]._alert, {title: 'TITLE', body: 'BODY'});
        assert.equal(ios.getProvider().send.getCall(0).args[1], 'a1');
        assert.equal(ios.getProvider().send.getCall(1).args[1], 'b2');
        assert.equal(ios.getProvider().send.getCall(2).args[1], 'c3');

        ios.getProvider().send.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly send notification with custom notification', done => {
    let ios = new APNNotification(CONFIG);

    sinon.stub(ios.getProvider(), 'send');

    ios
      .send(['b2', 'c3'], {
        body: 'OVERRIDE_BODY'
      })
      .then(() => {
        assert.ok(ios.getProvider().send.calledThrice);
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], '_alert.body', 'OVERRIDE_BODY');
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], '_sound', 'SOUND');
        assert.equal(ios.getProvider().send.getCall(0).args[1], 'a1');
        assert.equal(ios.getProvider().send.getCall(1).args[1], 'b2');
        assert.equal(ios.getProvider().send.getCall(2).args[1], 'c3');

        ios.getProvider().send.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly send notification with extended notification', done => {
    let ios = new APNNotification(CONFIG);

    sinon.stub(ios.getProvider(), 'send');

    ios
      .send(['b2'], {
        body: 'OVERRIDE_BODY'
      }, {
        priority: 5
      })
      .then(() => {
        assert.ok(ios.getProvider().send.calledTwice);
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], '_alert.body', 'OVERRIDE_BODY');
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], 'priority', 5);
        assert.equal(ios.getProvider().send.getCall(0).args[1], 'a1');
        assert.equal(ios.getProvider().send.getCall(1).args[1], 'b2');

        ios.getProvider().send.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly send notification with all empty config', done => {
    let ios = new APNNotification();

    sinon.stub(ios.getProvider(), 'send');

    ios
      .send()
      .then(() => {
        assert.ok(ios.getProvider().send.notCalled);
        ios.getProvider().send.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly send notification with empty pre-defined config and empty notification', done => {
    let ios = new APNNotification();

    sinon.stub(ios.getProvider(), 'send');

    ios
      .send(['a1'])
      .then(() => {
        assert.ok(ios.getProvider().send.calledOnce);
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], '_alert.title', undefined);
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], '_alert.body', undefined);
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], 'priority', 10);
        assert.equal(ios.getProvider().send.getCall(0).args[1], 'a1');

        ios.getProvider().send.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly send notification with empty pre-defined config and custom notification', done => {
    let ios = new APNNotification();

    sinon.stub(ios.getProvider(), 'send');

    ios
      .send(['a1'], {
        title: 'CUSTOM_TITLE',
        body: 'CUSTOM_BODY'
      }, {
        priority: 5
      })
      .then(() => {
        assert.ok(ios.getProvider().send.calledOnce);
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], '_alert.title', 'CUSTOM_TITLE');
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], '_alert.body', 'CUSTOM_BODY');
        assert.deepPropertyVal(ios.getProvider().send.getCall(0).args[0], 'priority', 5);
        assert.equal(ios.getProvider().send.getCall(0).args[1], 'a1');

        ios.getProvider().send.restore();

        done();
      })
      .catch(done);
  });
});
