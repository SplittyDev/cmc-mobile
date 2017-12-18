// Constants
const DISPLAY_LIMIT = 20;
const FETCH_INTV = 20000;

// Imports
const connector = new window.Connector();
const provider = new window.Provider(connector);
const builder = new window.HtmlBuilder();

function registerFavorites (cb) {
  function tapHandler(e, elem, cb) {
    const now = new Date().getTime();
    const diff = now - elem.lastTap;
    if (elem.lastTap > 0 && diff > 0 && diff < 200) {
      elem.lastTap = new Date().getTime() - 200;
      let favorites = State.getObject('favorites');
      let symbol = elem.getAttribute('data-symbol');
      function handleFavorite() {
        if (!favorites.list.includes(symbol)) {
          favorites.list.push(symbol);
          State.setObject('favorites', favorites);
          Notifier.alert({
            title: 'HYPPEEEE',
            text: `Added ${elem.getAttribute('data-name')} to favorites!`,
          });
        } else {
          favorites.list.splice(favorites.list.indexOf(symbol), 1);
          State.setObject('favorites', favorites);
          Notifier.alert({
            title: 'BOOO',
            text: `Removed ${elem.getAttribute('data-name')} from favorites.`,
          });
        }
        if (State.getString('scrollToTop')) {
          window.scrollTo(0, 0);
        }
      }
      function handleAlarm() {
        let currentPrice = elem.getAttribute('data-price');
        let currency = State.getString('currency');
        Notifier.prompt({
          title: 'Price Alarm',
          text: `Current price: ${currentPrice.toLocaleString()} ${currency}\nSet alarm for price:`,
          buttons: [
            'Set alarm (high)',
            'Set alarm (low)',
          ],
          callback: obj => {
            if (obj.input1 === "") return;
            const input = Number(obj.input1);
            let alarms = State.getObject('alarms');
            if (alarms[symbol] === void 0) {
              alarms[symbol] = [];
            }
            alarms[symbol].push({
              price: input,
              currency: currency,
              high: obj.buttonIndex === 1,
            });
            State.setObject('alarms', alarms);
            Alarm.update();
            Notifier.alert({
              title: 'Price Alarm',
              text: `Price alarm set for ${input} ${currency}!`,
            });
          },
        });
      }
      Notifier.confirm({
        title: 'Action!',
        text: 'What do you want to do?',
        buttons: [
          'Set price alarm',
          'Nevermind',
          favorites.list.includes(symbol)
          ? 'Remove from favorites'
          : 'Mark as favorite',
        ],
        callback: index => {
          if (index == 3) {
            handleFavorite();
          } else if (index == 1) {
            handleAlarm();
          }
        },
      });
      e.preventDefault();
      cb();
    } else {
      elem.lastTap = new Date().getTime();
    }
  }
  for (const elem of document.querySelectorAll('.coin')) {
    if (elem.favoriteRegistered) continue;
    elem.lastTap = 0;
    elem.addEventListener(
      'ontouchstart' in document.documentElement
      ? 'touchstart' : 'click', e => tapHandler(e, elem, cb));
    elem.favoriteRegistered = true;
  }
}

// Main functionality
function driverMain () {

    // Grab HTML elements
    const container = document.getElementsByClassName('container')[0];
    const searchBar = document.querySelector('.search-bar-input');

    const updateDom = async () => {

        // Get cached data
        // eslint-disable-next-line no-underscore-dangle
        const data = await provider.__retrieveCached({
            display_limit: undefined,
            currency: State.getString('currency'),
        });

        // Build html representation
        container.innerHTML = builder.build(data, {
            trunc_info_block: true,
            currency: State.getString('currency'),
            display_limit: DISPLAY_LIMIT,
        });

        registerFavorites(() => updateDom());
    };

    const fetchInitialize = async () => {

        // Fill cache
        await provider.fillCache({
            currency: State.getString('currency'),
        });

        // Update DOM
        updateDom();
    };

    const updateDomDynamic = async () => {

        // Test if search-bar is empty
        if (searchBar.value.length === 0) {
            // Update DOM from cache
            updateDom();
            return;
        }

        // Initialize variables
        let match = false;
        const altMatches = [];

        // Grab cached data
        // eslint-disable-next-line no-underscore-dangle
        const data = await provider.__retrieveCached({
            currency: State.getString('currency'),
        });

        // Iterate over cached coins
        data.forEach((coin) => {
            // Get lowercase search term
            const value = searchBar.value.toLowerCase();

            // Test if search term matches any coins
            if (
            coin.symbol.toLowerCase() === value
            || coin.id.toLowerCase() === value
            || coin.name.toLowerCase() === value
            ) {
              // We found a match
              match = true;

              // Update DOM with cached data
              container.innerHTML = builder.build([coin], {
                  currency: State.getString('currency'),
              });
            } else if (true // Test if alternative cryptocurrency matches
            && (false
              || coin.id.toLowerCase().includes(value)
              || coin.name.toLowerCase().includes(value)
              || coin.symbol.toLowerCase().includes(value))
            && altMatches.length < DISPLAY_LIMIT
          ) { // Add cryptocurrency to match list
            altMatches.push(coin);
          }
        });

        // Test if alternative matches were found
        if (!match && altMatches.length > 0) {
            // Update DOM with matched data
            container.innerHTML = builder.build(altMatches, {
              currency: State.getString('currency'),
            });
        } else if (!match) {
            container.innerHTML = '<div class="placeholder">¯\\_(ツ)_/¯</div>';
        }

        registerFavorites(() => updateDomDynamic());
    };

    // Initialize cache and update DOM
    fetchInitialize();

    // Set update interval
    setInterval(() => {

        // Update cache
        provider.fillCache({
            currency: State.getString('currency'),
        }).then(() => {
            // Update DOM dynamically
            updateDomDynamic();
            // eslint-disable-next-line no-console
        }).catch(err => console.error(err));
    }, FETCH_INTV);

    // Periodically check for currency-conversion change
    let oldCurrency = State.getString('currency');
    setInterval(() => {
      const newCurrency = State.getString('currency');
      if (oldCurrency !== newCurrency) {
        provider.fillCache({
          currency: newCurrency,
        }).then(() => updateDomDynamic());
      }
      oldCurrency = newCurrency;
    }, 500);

    // Handle search functionality
    searchBar.oninput = updateDomDynamic;
}

// Exports
window.Driver = {
  start: driverMain,
};
