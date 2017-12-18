let wasOffline = false;

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
    Alarm.ready();
    UITweaks.ready();
    Driver.start();
    document.addEventListener('backbutton', () => {
      View.present('main');
    });
  },

  onOffline: function() {
    wasOffline = true;
    Notifier.push({
      title: 'You are offline...',
      text: 'Sadly we can\'t fetch any coin info at the moment.',
    });
  },

  onOnline: function() {
    if (!wasOffline) return;
    wasOffline = false;
    Notifier.push({
      title: 'You are back online!',
      text: 'We\'re grabbing that sweet data for you.',
    });
  },
};

app.initialize ();
