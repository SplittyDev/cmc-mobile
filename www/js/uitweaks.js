window.UITweaks = {
  ready: function() {
    this.__prepareSearchBar();
  },

  // Defocus search bar when pressing enter
  __prepareSearchBar: function() {
    const search_bar = document.querySelector('.search-bar-input');
    search_bar.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        search_bar.blur();
        View.present('settings');
      }
    });
  },
};
