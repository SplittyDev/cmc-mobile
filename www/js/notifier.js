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
  pushAlert: function(obj) {
    this.push(obj);
    this.alert(obj);
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
  vibrate: function(duration) {
    let count = 3;
    function timeoutFunc() {
      navigator.notification.vibrate(200);
      if (count-- !== 0) {
        setTimeout(timeoutFunc, 400);
      }
    }
    navigator.notification.vibrate(200);
    setTimeout(timeoutFunc, 400);
  },
}
