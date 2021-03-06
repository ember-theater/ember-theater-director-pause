import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../../tests/helpers/module-for-acceptance';
import { hook } from 'ember-hook';

moduleForAcceptance('Acceptance | affinity-engine/stage/directions/pause');

const syncStep = function() {
  const event = Ember.$.Event("keyup", {
    keyCode: 32,
    which: 32,
    altKey: true,
    ctrlKey: true,
    shiftKey: true
  });

  Ember.$(document).trigger( event );
}

test('Affinity Engine | Director | Directions | Pause', function(assert) {
  assert.expect(10);

  visit('/affinity-engine/test-scenarios/stage/directions/pause');

  andThen(() => {
    syncStep();

    assert.equal(Ember.$(hook('data')).text().trim(), '', 'still awaiting');
  });

  delay(200);

  andThen(() => {
    assert.equal(Ember.$(hook('data')).text().trim(), '1', 'waited 100ms');

    syncStep();

    assert.equal(Ember.$(hook('data')).text().trim(), '1', 'still waiting');
  });

  keyUp('KeyA');

  andThen(() => {
    assert.equal(Ember.$(hook('data')).text().trim(), '2', 'waited until keyup');

    syncStep();

    assert.equal(Ember.$(hook('data')).text().trim(), '2', 'still waiting');
  });

  keyUp('KeyA');

  andThen(() => {
    assert.equal(Ember.$(hook('data')).text().trim(), '3', 'waited until keyup, rather than 100ms');

    syncStep();

    assert.equal(Ember.$(hook('data')).text().trim(), '3', 'still waiting');
  });

  delay(300);

  andThen(() => {
    assert.equal(Ember.$(hook('data')).text().trim(), '4', 'waited until 100ms, rather than keyup');

    syncStep();

    assert.equal(Ember.$(hook('data')).text().trim(), '4', 'still waiting');
  });

  delay(300);

  andThen(() => {
    assert.equal(Ember.$(hook('data')).text().trim(), '5', 'waited until promise resolved');
  });
});
