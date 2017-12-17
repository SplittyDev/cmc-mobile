class CoinMarketCapHtmlBuilder {
  /**
   * Creates an instance of CoinMarketCapHtmlBuilder.
   *
   * @param {any} options
   * @memberof CoinMarketCapHtmlBuilder
   */
  constructor(options) {
    this.options = options || {};
  }

  build(data, options) {
    // Merge options
    const finalOptions = Object.assign({
      currency: null,
      trunc_info_block: false,
      display_limit: 0,
    }, this.options || {}, options || {});

    // Sanitize: Make currency an uppercase string.
    finalOptions.currency = String(options.currency || 'USD').toUpperCase();

    // Sanitize: Make trunc_info_block a boolean.
    finalOptions.trunc_info_block = Boolean(options.trunc_info_block);

    // Get lowercase currency name
    const currencyLower = finalOptions.currency.toLowerCase();

    // Create html string
    let html = String();

    // Sort favorites
    const favorites = JSON.parse(
      localStorage.getItem('favorites')
      || JSON.stringify({list:[]}));
    data.sort((a, b) => {
      let a_mc = a[`market_cap_${currencyLower}`];
      let b_mc = b[`market_cap_${currencyLower}`];
      if (favorites.list.includes(a.symbol) && !favorites.list.includes(b.symbol)) {
        return -1;
      } else if (favorites.list.includes(b.symbol)) {
        return 1;
      }
      return b_mc - a_mc;
    });

    let i = 0;

    // Iterate over cryptocurrencies
    for (const cc of data) {
      if (options.display_limit !== 0 && i++ > options.display_limit) break;
      html += `
      <li class="coin" data-name="${cc.name}" data-symbol="${cc.symbol}">
        <div class="header">
          <span class="coin-name">${cc.name}</span>
          <span class="coin-symbol" data-favorite="${favorites.list.includes(cc.symbol)}">${cc.symbol}</span>
        </div>
        <div class="market">
          <div class="cat cat-price">
            <span class="title">Price</span>
            <div class="elem">
              <span class="label">Fiat</span>
              <span class="value">${cc[`price_${currencyLower}`].toLocaleString("en")}</span>
              <span class="currency">${options.currency}</span>
            </div>
            <div class="elem">
              <span class="label">Crypto</span>
              <span class="value">${cc.price_btc.toLocaleString("en")}</span>
              <span class="currency">BTC</span>
            </div>
          </div>
          <div class="cat cat-market">
            <span class="title">Market</span>
            <div class="elem">
              <span class="label">24h Volume</span>
              <span class="value">${cc[`24h_volume_${currencyLower}`].toLocaleString("en")}</span>
              <span class="currency">${options.currency}</span>
            </div>
            <div class="elem">
              <span class="label">Market Cap</span>
              <span class="value">${cc[`market_cap_${currencyLower}`].toLocaleString("en")}</span>
              <span class="currency">${options.currency}</span>
            </div>
            <div class="elem">
              <span class="label">Available Supply</span>
              <span class="value">${cc.available_supply.toLocaleString("en")}</span>
              <span class="currency">${cc.symbol}</span>
            </div>
            <div class="elem">
              <span class="label">Total Supply</span>
              <span class="value">${cc.total_supply.toLocaleString("en")}</span>
              <span class="currency">${cc.symbol}</span>
            </div>
          </div>
          <div class="cat cat-change">
            <span class="title">Change</span>
            <div class="elem">
              <span class="label">1h</span>
              <span class="value">${cc.percent_change_1h}</span>
              <span class="unit">%</span>
              <span class="arrow arrow-${cc.percent_change_1h > 0 ? 'up' : 'down'}">
                ${(cc.percent_change_1h > 0) ? '&uarr;' : '&darr;'}
              </span>
            </div>
            <div class="elem">
              <span class="label">24h</span>
              <span class="value">${cc.percent_change_24h}</span>
              <span class="unit">%</span>
              <span class="arrow arrow-${cc.percent_change_24h > 0 ? 'up' : 'down'}">
              ${(cc.percent_change_24h > 0) ? '&uarr;' : '&darr;'}
            </span>
            </div>
            <div class="elem">
              <span class="label">7d</span>
              <span class="value">${cc.percent_change_7d}</span>
              <span class="unit">%</span>
              <span class="arrow arrow-${cc.percent_change_7d > 0 ? 'up' : 'down'}">
                ${(cc.percent_change_7d > 0) ? '&uarr;' : '&darr;'}
              </span>
            </div>
          </div>
        </div>
      </li>
      `;
    }

    // Test if truncation info block should be included
    if (options.trunc_info_block === true) {
      html += `
      <li class="coin">
        <div class="truncation-notice">
          <span class="question">
            <abbr title="Results are truncated for performance reasons.">
              Missing a certain cryptocurrency?
            </abbr>
          </span><br>
          <span class="hint">
            <abbr title="Use the search function.">
              Seek and you shall find.
            </abbr>
          </span>
        </div>
      </li>
      `;
    }

    // Wrap li elements in ul element
    html = `<ul class="coins">${html}</ul>`;

    // Return built html structure
    return html;
  }
}

// Exports
window.HtmlBuilder = CoinMarketCapHtmlBuilder;
