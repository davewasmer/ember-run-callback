import Ember from 'ember';
import callback from 'ember-run-callback';

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
    }
  }

});
