window.Notifier = {
  alert: function(obj) {
    navigator.notification.alert(
      obj.text,
      obj.callback,
      obj.title
    );
  },
  push: function(obj) {
    try {
      cordova.plugins.notification.local.schedule(obj);
    } catch (_) { }
  },
  confirm: function(obj) {
    navigator.notification.confirm(
      obj.text,
      obj.callback,
      obj.title,
      obj.buttons
    );
  },
  prompt: function(obj) {
    navigator.notification.prompt(
      obj.text,
      obj.callback,
      obj.title,
      obj.buttons,
      obj.default
    );
  },
}
