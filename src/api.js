const API_KEY =
  "380ec498044c900f249ad39326e8320a2cb4ee09b94afe4dff6911e37ef56bfc";

const tickersHandlers = new Map(); // {}
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);
// [ ] Если нет курса к доллару, проверять, есть ли курс к BTC и делать через BTC|  Критичность: 4

const AGGREGATE_INDEX = "5";
let isBTCsubscription = false;
let BTCcourse = null;

socket.addEventListener("message", (e) => {
  let {
    TYPE: type,
    FROMSYMBOL: currency,
    TOSYMBOL: fromCurrency,
    PRICE: newPrice,
    PARAMETER: parameterString,
    MESSAGE: message,
  } = JSON.parse(e.data);

  if (message === "INVALID_SUB") {
    subscribeToBTC(parameterString);
    return null;
  }

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return null;
  }

  if (fromCurrency === "BTC") {
    newPrice = BTCtoUSD(newPrice);
    console.log(currency, newPrice);
  }

  if (currency === "BTC") {
    BTCcourse = newPrice;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));

  function subscribeToBTC(parameterString) {
    const parameters = parameterString.split("~");
    let fromCurrency = parameters[2];
    let toCurrency = parameters[3];

    if (toCurrency === "BTC") return;
    unsubscribeFromTicker(fromCurrency);
    // subscribeToTicker(
    //   fromCurrency,
    //   "BTC",
    //   (newPrice) => (BTCcourse = newPrice)
    // );
  }
});

function BTCtoUSD(price) {
  if (!isBTCsubscription) {
    subscribeToTicker("BTC", "USD", (newPrice) => newPrice);
  }
  return price * BTCcourse;
}

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker, currency) {
  if (ticker === "BTC") {
    isBTCsubscription = true;
  }
  webSocketAction(ticker, "SubAdd", currency);
}

function unsubscribeFromTickerOnWs(ticker) {
  if (ticker === "BTC") {
    isBTCsubscription = false;
  }
  webSocketAction(ticker, "SubRemove", "USD");
  webSocketAction(ticker, "SubRemove", "BTC");
}

function webSocketAction(ticker, action, currency) {
  sendToWebSocket({
    action,
    subs: [`5~CCCAGG~${ticker}~${currency}`],
  });
}

const subscribeToTicker = (ticker, currency, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker, currency);
};

export const subscribeToTickerUSD = (ticker, cb) => {
  subscribeToTicker(ticker, "USD", cb);
};
export const subscribeToTickerBTC = (ticker, cb) => {
  subscribeToTicker(ticker, "BTC", cb);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

export async function getCoinsList() {
  let coinsList = [];
  let response = await fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  );

  if (response.ok) {
    const responseJSON = await response.json();
    const data = await responseJSON.Data;

    for (const key in data) {
      const coin = {
        symbol: data[key]?.Symbol,
        fullName: data[key]?.FullName,
      };
      coinsList.push(coin);
    }

    return coinsList;
  } else {
    console.error("HTTP error: " + response.status);
    return null;
  }
}
