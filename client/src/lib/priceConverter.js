import BN from 'bn.js';

const weiToEth = 1e18;

function getConversionPrice() {
  let params = new URLSearchParams();
  params.append("ids", "ethereum");
  params.append("vs_currencies", "USD")
  return fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD")
    .then((response) => response.json())
    .then((json) => new BN(json.ethereum.usd))
}

export async function ethToUSD(ethValue) {
  let conversion = await getConversionPrice();
  return ethValue * conversion;
}

export async function USDToEth(usdValue) {
  let conversion = await getConversionPrice();
  return usdValue / conversion;
}

export async function weiToUSD(weiValue) {
  return await ethToUSD(weiValue / weiToEth);
}

export async function USDToWei(usdValue) {
  return weiToEth * await USDToEth(usdValue);
}

export async function getWeiValue(value, currency) {
  switch(currency) {
    case "USD":
      return await USDToWei(value);
    case "ETH":
      return value * weiToEth;
    case "WEI":
      return value;
    default:
      throw new Error("Unhandled currency " + currency)
  }
}

export async function getEthValue(value, currency) {
  switch(currency) {
    case "USD":
      return await USDToEth(value);
    case "ETH":
      return value;
    case "WEI":
      return value / weiToEth;
    default:
      throw new Error("Unhandled currency " + currency)
  }
}

export async function getUSDValue(value, currency) {
  switch(currency) {
    case "USD":
      return value;
    case "ETH":
      return await ethToUSD(value);
    case "WEI":
      return await weiToUSD(value);
    default:
      throw new Error("Unhandled currency " + currency)
  }
}

export async function getValue(value, fromCurrency, toCurrency) {
  switch(toCurrency) {
    case "USD":
      return await getUSDValue(value, fromCurrency);
    case "ETH":
      return await getEthValue(value, fromCurrency);
    case "WEI":
      return await getWeiValue(value, fromCurrency);
    default:
      throw new Error("Unhandled currency " + toCurrency)
  }
}
