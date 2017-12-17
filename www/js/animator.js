window.Animator = {
  fadeIn: function(elem, speed) {
    if (elem.style.display === 'block') return;
    var opacity = 0.0;
    elem.style.opacity = opacity;
    elem.style.display = 'block';
    function step () {
        opacity += speed;
        if (opacity >= 1.0){
            elem.style.opacity = 1.0;
            return true;
        }
        elem.style.opacity = opacity;
        requestAnimationFrame(step);
    }
    step();
  },
  fadeOut: function(elem, speed) {
    if (elem.style.display === 'none') return;
    var opacity = 1.0;
    elem.style.opacity = opacity;
    elem.style.display = 'block';
    function step () {
        opacity -= speed;
        if (opacity <= 0.0){
            elem.style.opacity = 0.0;
            elem.style.display = 'none';
            return true;
        }
        elem.style.opacity = opacity;
        requestAnimationFrame(step);
    }
    step();
  },
};
