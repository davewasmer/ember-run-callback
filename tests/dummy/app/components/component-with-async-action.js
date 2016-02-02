import Ember from 'ember';
import callback from 'ember-run-callback';

const { run } = Ember;

export default Ember.Component.extend({

  asyncDidRun: false,

  actions: {
    runLater() {
      Ember.run.later(() => {
        this.set('asyncDidRun', true);
      }, 500);
    },
    runCallback() {
      setTimeout(callback(() => {
        return new Ember.RSVP.Promise((resolve) => {
          this.set('asyncDidRun', true);
          resolve();
        });
      }), 500);
    },

    runCallbackWithAsync() {
      setTimeout(callback(() => {
        return new Ember.RSVP.Promise((resolve) => {
          setTimeout(() => {
            run(() => {
              this.set('asyncDidRun', true);

              resolve();
            });
          }, 500);
        });
      }));
    }
  }

});
