import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | async callbacks');

test('Ember.run.later()', function(assert) {
  visit('/');
  click('.run-later');
  andThen(() => {
    assert.equal(find('.status').text().trim(), 'Async ran');
  });
});
test('callback() wrapped', function(assert) {
  visit('/');
  click('.run-callback');
  andThen(() => {
    assert.equal(find('.status').text().trim(), 'Async ran');
  });
});
