window.Alarm = {
  ready: function() {
    this.__updateAlarms();
    this.__registerHandlers();
  },

  update: function() {
    this.__updateAlarms();
  },

  __updateAlarms: function() {
    const elem = document.querySelector('.alarm-list-container');
    while (elem.lastChild) {
      elem.removeChild(elem.lastChild);
    }
    let alarms = State.getObject('alarms');
    for (const prop in alarms) {
      if (!alarms.hasOwnProperty(prop)) continue;
      let list = alarms[prop];
      if (list.length === 0) continue;
      list.sort((a, b) => {
        return a.high ? b.high ? b.price - a.price : -1 : 1;
      });
      let frag = document.createDocumentFragment();
      let container = document.createElement('div');
      container.classList.add('alarm-list');
      let label = document.createElement('span');
      label.classList.add('alarm-category-header');
      label.textContent = prop;
      let ul = document.createElement('ul');
      ul.classList.add('alarm-category');
      for (const item of list) {
        let li = document.createElement('li');
        let left = document.createElement('span');
        left.classList.add('price');
        left.textContent = item.price;
        let right = document.createElement('span');
        right.classList.add('currency');
        right.textContent = item.currency;
        let momentum = document.createElement('span');
        momentum.classList.add('momentum');
        momentum.innerHTML = item.high ? '&uarr;' : '&darr;';
        let del = document.createElement('input');
        del.setAttribute('type', 'button');
        del.setAttribute('value', 'Unset');
        del.addEventListener('click', e => {
          del.blur();
          list.splice(list.indexOf(item), 1);
          alarms[prop] = list;
          State.setObject('alarms', alarms);
          Animator.fadeOut(li, 0.05, () => {
            Alarm.update();
          });
          e.preventDefault();
        });
        li.appendChild(left);
        li.appendChild(right);
        li.appendChild(momentum);
        li.appendChild(del);
        ul.appendChild(li);
      }
      container.appendChild(label);
      container.appendChild(ul);
      frag.appendChild(container);
      elem.appendChild(frag);
    }
  },

  __registerHandlers: function() {
    for (const elem of document.querySelectorAll('[alarm-update]')) {
      elem.addEventListener('click', e => {
        Alarm.update();
        e.preventDefault();
      });
    }
  },
};
