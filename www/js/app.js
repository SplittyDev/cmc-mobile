const app = {

  //
  // Initialization logic
  //

  initialize: function() {
      this.bindEvents();
  },

  bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
      document.addEventListener('offline', this.onOffline, false);
      document.addEventListener('online', this.onOnline, false);
  },

  //
  // Event handlers
  //

  onDeviceReady: function() {
    State.ready();
    View.ready();
    UITweaks.ready();
    Driver.start();
  },

  onOffline: function() {
    Notifier.push({
      title: 'You are offline...',
      text: 'Sadly we can\'t fetch any coin info at the moment.',
    });
  },

  onOnline: function() {
    Notifier.push({
      title: 'You are back online!',
      text: 'We\'re grabbing that sweet market data for you.',
    });
  },
};

app.initialize ();
