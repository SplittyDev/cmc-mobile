// Constants
const DISPLAY_LIMIT = 20;
const FETCH_INTV = 20000;
const CURRENCY = "USD";

// Imports
const connector = new window.Connector();
const provider = new window.Provider(connector);
const builder = new window.HtmlBuilder();

// Main functionality
function driverMain () {

    // Grab HTML elements
    const container = document.getElementsByClassName('container')[0];
    const searchBar = document.querySelector('.search-bar-input');

    const updateDom = async () => {

        // Get cached data
        // eslint-disable-next-line no-underscore-dangle
        const data = await provider.__retrieveCached({
            display_limit: DISPLAY_LIMIT,
            currency: CURRENCY,
        });

        // Build html representation
        container.innerHTML = builder.build(data, {
            trunc_info_block: true,
            currency: CURRENCY,
        });
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
            && coin.name.toLowerCase().includes(value)
            && altMatches.length < DISPLAY_LIMIT
            ) altMatches.push(coin); // Add cryptocurrency to match list
        });

        // Test if alternative matches were found
        if (!match && altMatches.length > 0) {
            // Update DOM with matched data
            container.innerHTML = builder.build(altMatches, {
            currency: CURRENCY,
            });
        } else if (!match) {
            container.innerHTML = '<div class="placeholder">Cryptocurrency not found :(</div>';
        }
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
