let HTTPTickerNames = [];
let tickerUpdateInterval = null;
const tickersHandlers = new Map();

export function subscribeToTickerOnHTTP(tickerName, handlers) {
  HTTPTickerNames.push(tickerName);
  tickersHandlers.set(tickerName, handlers);
  if (HTTPTickerNames.length > 1) return;
  subscribeToTickers();
}

function subscribeToTickers() {
  const url = new URL("https://min-api.cryptocompare.com/data/pricemulti");
  url.searchParams.set("tsyms", "USD");
  updateTickers();
  tickerUpdateInterval = setInterval(updateTickers, 5000);
  function updateTickers() {
    url.searchParams.set("fsyms", HTTPTickerNames.join(","));
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // console.log(tickersHandlers, data);
        tickersHandlers.forEach((handlers, currency) => {
          console.log(currency, handlers);
          handlers.forEach((fn) => fn(data[currency].USD));
        });
      });
    // handlers.forEach((fn) => fn(newPrice));
  }
}

export function unsubscribeFromTickerOnHTTP(tickerName) {
  HTTPTickerNames = HTTPTickerNames.filter((item) => item !== tickerName);
  if (HTTPTickerNames.length > 0) return;
  clearInterval(tickerUpdateInterval);
}
