window.State = {

  //
  // Initializer
  //

  ready: function() {
    this.__prepare();
    this.__registerHandlers();
    this.__updateHighlights();
  },

  //
  // Getters
  //

  getString: function(key) {
    return localStorage.getItem(key);
  },

  getObject: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  //
  // Update
  //

  setString: function(key, val) {
    localStorage.setItem(key, val);
    this.__updateHighlights();
  },

  setObject: function(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    this.__updateHighlights();
  },

  //
  // Internal
  //

  __prepare: function() {
    this.__prepareDefault('favorites', JSON.stringify({ list: [] }));
    this.__prepareDefault('alarms', JSON.stringify({ }));
    this.__prepareDefault('currency', 'USD');
    this.__prepareDefault('scrollToTop', 'true');
    this.__prepareDefault('vibrateOnAlarm', 'false');
  },

  __prepareDefault: function(key, val) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, val);
    }
  },

  __registerHandlers: function() {
    for (let elem of document.querySelectorAll('[state-update-key]')) {
      elem.addEventListener('click', e => {
        elem.blur();
        let [key, val] = [
          elem.getAttribute('state-update-key'),
          elem.getAttribute('state-update-val'),
        ];
        this.setString(key, val);
        if (elem.hasAttribute('state-feedback')) {
          Notifier.alert({
            title: 'State Manager',
            text: `Set ${key} to ${val}!`,
          });
        }
        e.preventDefault();
      });
    }
    for (let elem of document.querySelectorAll('[state-reset]')) {
      elem.addEventListener('click', e => {
        elem.blur();
        let key = elem.getAttribute('state-reset');
        localStorage.removeItem(key);
        this.__prepare();
        if (elem.hasAttribute('state-feedback')) {
          Notifier.alert({
            title: 'State Manager',
            text: `Successfully reset ${key}.`,
          });
        }
        e.preventDefault();
      });
    }
  },

  __updateHighlights: function() {
    for (let elem of document.querySelectorAll('[state-highlight-if]')) {
      let [key, expected] = [
        elem.getAttribute('state-highlight-if'),
        elem.getAttribute('state-highlight-is'),
      ];
      if (this.getString(key) === expected) {
        elem.classList.add('state--highlight');
      } else {
        elem.classList.remove('state--highlight');
      }
    }
  },
};
