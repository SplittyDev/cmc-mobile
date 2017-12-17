window.State = {

  //
  // Initializer
  //

  ready: function() {
    this.__prepare();
    this.__registerHandlers();
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
  },

  setObject: function(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },

  //
  // Internal
  //

  __prepare: function() {
    this.__prepareDefault('favorites', JSON.stringify({ list: [] }));
    this.__prepareDefault('currency', 'USD');
  },

  __prepareDefault: function(key, val) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, val);
    }
  },

  __registerHandlers: function() {
    for (let elem of document.querySelectorAll('[state-update]')) {
      elem.addEventListener('click', e => {
        elem.blur();
        let [key, val] = [
          elem.getAttribute('state-update'),
          elem.getAttribute('state-value'),
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
  },
};
