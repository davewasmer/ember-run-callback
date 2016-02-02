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
    let result = run(invocation.fn);

    return Ember.RSVP.resolve(result)
      .then(() => {
        invocation.isFinished = true;

        delete stateMap[invocation.id];
      });
  }

  if (hasTest) {
    Test.registerWaiter(invocation.waiter);
  }

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
