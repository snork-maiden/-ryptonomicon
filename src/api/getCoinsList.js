export default async function getCoinsList() {
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
