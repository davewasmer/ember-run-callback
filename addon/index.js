import Ember from 'ember';

const run = Ember.run;
const Test = Ember.Test;

let stateMap = {};
let guid = 0;

export default function(fn) {
  let invocation = {
    fn,
    id: guid++,
    isFinished: false,
    waiter() {
      if (invocation.isFinished) {
        Test.unregisterWaiter(invocation.waiter);
      }
      return invocation.isFinished;
    }
  };
  function wrapped() {
    run(invocation.fn);
    console.log('invcation ran');
    invocation.isFinished = true;
    delete stateMap[invocation.id];
  }
  Test.registerWaiter(invocation.waiter);
  stateMap[invocation.id] = invocation;
  wrapped.__callback_guid = invocation.id;
  return wrapped;
}

export function cancel(wrapped) {
  if (wrapped && stateMap[wrapped.__callback_guid]) {
    let callback = stateMap[wrapped.__callback_guid];
    Test.unregisterWaiter(callback.waiter);
    callback.fn = Ember.RSVP.resolve;
    stateMap.delete(wrapped);
  }
}
