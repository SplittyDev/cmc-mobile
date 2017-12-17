window.View = {
  ready: function() {
    this.__initHandlers();
  },
  present: function(name) {
    const vall = document
      .querySelectorAll(`[view]:not([view=${name}])`);
    for (const view of vall) {
      window.Animator.fadeOut(view, 0.1);
    }
    window.Animator.fadeIn(
      document.querySelector(`[view=${name}]`), 0.025);
  },
  __initHandlers: function() {
    for (const trigger of document.querySelectorAll('[view-present]')) {
      trigger.addEventListener('click', e => {
        this.present(trigger.getAttribute('view-present'));
        e.preventDefault();
      }, false);
    }
  },
};
