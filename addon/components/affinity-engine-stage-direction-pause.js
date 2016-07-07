import Ember from 'ember';
import { EKMixin, keyUp } from 'ember-keyboard';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  get,
  getProperties,
  isPresent
} = Ember;

const { computed: { alias } } = Ember;
const { run: { later } } = Ember;

export default Component.extend(DirectableComponentMixin, EKMixin, {
  keyboardActivated: alias('isFocused'),

  init(...args) {
    this._super(...args);

    if (get(this, 'priorSceneRecord') === '_RESOLVED') {
      this.resolveAndDestroy(true);
    }
  },

  didInsertElement(...args) {
    this._super(...args);

    const attrs = get(this, 'directable.attrs');

    const {
      duration,
      keys,
      promise
    } = getProperties(attrs, 'duration', 'keys', 'promise');

    if (isPresent(keys)) {
      this._setupKeyPressWatcher(keys);
    }

    if (isPresent(duration)) {
      later(() => {
        this._resolve();
      }, duration);
    }

    if (isPresent(promise)) {
      promise.then(() => {
        this._resolve();
      });
    }
  },

  willDestroyElement(...args) {
    this._super(...args);

    this._resolve();
  },

  _resolve() {
    this.resolveAndDestroy();
  },

  _setupKeyPressWatcher(keys) {
    keys.forEach((key) => {
      this.on(keyUp(key), this._resolve);
    });
  }
});
