# ember-run-callback

Provides `callback()`, which lets you easily write runloop and test aware async code:

```js
Ember.Component.extend({
  actions: {

    addCreditCard(card) {
      Stripe.addCard(card, callback(() => {
        this.transitionTo('index');
      }));
    }

  }
});
```

Now, in your tests, you can:

```js
click('.add-credit-card');
andThen(function() {
  assert(currentRouteName() === 'index');
});
```

The `callback()` method takes the function which you want to be able to run asynchronously, and returns a wrapped function you can use in it's place.

When you invoke `callback()`, it will notify Ember that some async activity is taking place (via `registerWaiter`) so your tests will wait for that activity to complete.

When the returned wrapper function is eventually called, it will call your original function (wrapped in an `Ember.run()`) call, and notify Ember that this particular async activity has finished.

**NOTE:** When you invoke `callback()` to get your wrapper function, Ember is _immediately_ notified of an async activity. This means that if you never call the wrapper function that is returned, Ember will never be notified that the async activity ended, and your tests will hang.

If you need to abort the callback, you can use the supplied `cancel()` method and pass in the wrapper function you got from `callback()`:

```js
import callback, { cancel } from 'ember-run-callback';

let wrapper = callback(function() { /* ... */ }));
cancel(wrapper);
```

See the [related RFC](https://github.com/emberjs/rfcs/pull/115) for details and the motivation.
