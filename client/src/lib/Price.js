import { getValue } from './priceConverter'


class Price {

  constructor(weiValues, currencies) {
    this.weiValues = weiValues;
    this.currencies = currencies;
    this.currentValues = {};
    this.loaded = false;
    this.loading = false;
    this.loadPrices();
  }

  loadPrices() {
    this.loading = true;

    let currencyValues = this.currencies.map((currency) => {
      return this.weiValues.map((value) => {
        return { value, currency }
      })
    }).flat();

    let promises = currencyValues.map(({ value, currency }) => {
      return getValue(value, "WEI", currency);
    });

    Promise.all(promises).then((results) => {
      this.loading = false;
      results.forEach((res, i) => {
        let { value, currency } = currencyValues[i];
        this.currentValues[value][currency] = res;
      })
    })
  }

  getCurrencyValue(value, currency) {
    if (this.currencies.indexOf(currency) === -1) {
      throw new Error(`Invalid currency ${currency}.`)
    }
    return this.currentValues[value][currency];
  }

}
