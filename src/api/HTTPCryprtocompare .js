let HTTPTickerNames = [];
let tickerUpdateInterval = null;

export function subscribeToTickerOnHTTP(parameterString) {
  const tickerName = getTickerName(parameterString);

  HTTPTickerNames.push(tickerName);
  if (HTTPTickerNames.length > 1) return;

  subscribeToTickers();

  function getTickerName(parameterString) {
    const parameters = parameterString.split("~");
    let fromCurrency = parameters[2];
    return fromCurrency;
  }
}

function subscribeToTickers() {
  const url = new URL("https://min-api.cryptocompare.com/data/pricemulti");
  updateTickers();
  tickerUpdateInterval = setInterval(updateTickers, 5000);
  url.searchParams.set("tsyms", "USD");
  function updateTickers() {
    console.log(HTTPTickerNames.join(","));
    url.searchParams.set("fsyms", HTTPTickerNames.join(","));
    fetch(url).then((data) => console.log(data.json()));
  }
}

export function unsubscribeFromTickerOnHTTP(tickerName) {
  HTTPTickerNames = HTTPTickerNames.filter((item) => item !== tickerName);
  if (HTTPTickerNames.length > 0) return;
  clearInterval(tickerUpdateInterval);
}

