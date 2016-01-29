import Ember from 'ember';

const run = Ember.run;
const Test = Ember.Test;
const hasTest = !!Test;

let stateMap = {};
let guid = 0;

export default function(fn) {
  let invocation = {
    fn,
    id: guid++,
    isFinished: false,
    waiter() {
      if (invocation.isFinished && hasTest) {
        Test.unregisterWaiter(invocation.waiter);
      }
      return invocation.isFinished;
    }
  };
  function wrapped() {
    run(invocation.fn);
    invocation.isFinished = true;
    delete stateMap[invocation.id];

    return invocation.id;
  }
  if (hasTest) {
    Test.registerWaiter(invocation.waiter);
  }
  stateMap[invocation.id] = invocation;
  wrapped.__callback_guid = invocation.id;

  return wrapped();
}

export function cancel(id) {
  let callback = stateMap[id];

  if (callback) {
    Test.unregisterWaiter(callback.waiter);
    callback.fn = function() { };

    delete stateMap[id];
  }
}
