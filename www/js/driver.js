// Constants
const DISPLAY_LIMIT = 20;
const FETCH_INTV = 20000;
const CURRENCY = "USD";

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
      let favorites = JSON.parse(localStorage.getItem('favorites') || JSON.stringify({list:[]}));
      let symbol = elem.getAttribute('data-symbol');
      if (!favorites.list.includes(symbol)) {
        favorites.list.push(symbol);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        navigator.notification.alert(`Added ${elem.getAttribute('data-name')} to favorites!`, null, 'HYPPEEEE');
      } else {
        favorites.list.splice(favorites.list.indexOf(symbol), 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        navigator.notification.alert(`Removed ${elem.getAttribute('data-name')} from favorites.`, null, 'There you go');
      }
      e.preventDefault();
      window.scrollTo(0, 0);
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
            currency: CURRENCY,
        });

        // Build html representation
        container.innerHTML = builder.build(data, {
            trunc_info_block: true,
            currency: CURRENCY,
            display_limit: DISPLAY_LIMIT,
        });

        registerFavorites(() => updateDom());
    };

    const fetchInitialize = async () => {

        // Fill cache
        await provider.fillCache({
            currency: CURRENCY,
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
            currency: CURRENCY,
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
                  currency: CURRENCY,
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
              currency: CURRENCY,
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
            currency: CURRENCY,
        }).then(() => {
            // Update DOM dynamically
            updateDomDynamic();
            // eslint-disable-next-line no-console
        }).catch(err => console.error(err));
    }, FETCH_INTV);

    // Handle search functionality
    searchBar.oninput = updateDomDynamic;
}

// Exports
window.Driver = {
    start: driverMain,
};
