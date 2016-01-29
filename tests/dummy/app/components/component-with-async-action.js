import Ember from 'ember';
import callback, { cancel } from 'ember-run-callback';

export default Ember.Component.extend({

  asyncDidRun: false,

  actions: {
    runLater() {
      Ember.run.later(() => {
        this.set('asyncDidRun', true);
      }, 500);
    },
    runCallback() {
      callback(() => {
        return new Ember.RSVP.Promise((resolve) => {
          this.set('asyncDidRun', true);
          resolve();
        });
      });
    },

    runAndCancel() {
      let foo = callback(() => {
        return new Ember.RSVP.Promise((resolve) => {
          setTimeout(() => {

            if (!this.isDestroyed) {
              this.set('asyncDidRun', true);
            }

            resolve();
          }, 1000);
        });
      });

      setTimeout(() => {
        cancel(foo);
      }, 250);
    }
  }

});
