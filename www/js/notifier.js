window.Notifier = {
  alert: function(obj) {
    navigator.notification.alert(obj.text, obj.callback, obj.title);
  },
  push: function(obj) {
    try {
      cordova.plugins.notification.local.schedule(obj);
    } catch (_) { }
  },
}
