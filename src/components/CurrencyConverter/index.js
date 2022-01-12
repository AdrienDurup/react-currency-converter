/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-useless-constructor */
import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
// import { setRequestOtions } from '../tools';
// import currencies from '../../data/currencies';
import TEST_DATA from '../../data/test-data';
import CurrencyList from '../CurrencyList';
import ResultBox from '../ResultBox';

export default class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    // this.setResult = this.setResult.bind(this);
    // this.setAmount = this.setAmount.bind(this);
    this.host = 'https://free.currconv.com';
    this.state = {
      currenciesArray: [],
      filteredCurrencies: [],
      amount: 1,
      currencyInputName: 'Euro',
      currencyInputId: 'EUR',
      currencyName: 'United States Dollar',
      currencyId: 'USD',
      rate: 0,
      computed: 0,
    };
    this.init();
  }

  componentDidMount() {
    console.log("list mounted");
    const { currencyName } = this.state;
    document.title = `Converter ${currencyName}`;
    console.log(localStorage.getItem('selectedCurrency'));
    this.setState({ currencyId: localStorage.getItem('selectedCurrency') });
  }

  componentDidUpdate() {
    console.log("list updated");
    const { currencyName } = this.state;
    document.title = `Converter ${currencyName}`;
  }

  getCurrenciesFromAPI = async () => {
    try {
      console.log('call to API');
      const queryResult = await fetch(`${this.host}/api/v7/currencies?apiKey=fca40546187d511c5280`);
      const { results } = await queryResult.json();
      let currencyArray = Object.entries(results);
      currencyArray = currencyArray.map((el) => {
        /* We get currencyName in value object {currencyName,(symbol),id} */
        const [id, { currencyName }] = el;
        return { id, currencyName };
      });
      return currencyArray;
    }
    catch (e) {
      console.log(e);
      // return null;

      return TEST_DATA;
    }
  };

  getConversion = async (idFromInput, idFromList) => {
    try {
      console.log('call to API');
      /* Convert with API from one currency to another */
      const result = await fetch(`${this.host}/api/v7/convert?q=${idFromInput}_${idFromList}&compact=ultra&apiKey=fca40546187d511c5280`);
      const conversionRates = await result.json();
      /* we only get the rate we need */
      const conversionRate = conversionRates[`${idFromInput}_${idFromList}`];
      return conversionRate;
    }
    catch (e) {
      console.log(e);
      // return null;
      /* for test */
      return (Math.random() + 1);
    }
  }

  init = async () => {
    /* get initial conversion from API https://www.currencyconverterapi.com/ */
    const defaultRate = await this.getConversion('EUR', 'USD');

    /* default state values */

    const amountDefault = 1;
    const currenciesArray = await this.getCurrenciesFromAPI();
    const initialState = {
      /* get currency list from API https://www.currencyconverterapi.com/ */
      currenciesArray,
      filteredCurrencies: currenciesArray,
      amount: amountDefault,
      // currencyInputName: 'Euro',
      // currencyInputId: 'EUR',
      currencyName: currenciesArray.find((el) => el.id === 'USD').currencyName,
      // currencyId: 'USD',
      rate: defaultRate,
      /* we calculate default "computed" value start amount * currency rate */
      computed: this.compute(amountDefault, defaultRate),
    };
    this.setState(() => initialState);
  }

  setResult = async (e) => {
    const listItem = e.target.closest('li');
    /* dataset is of shape {name,rate} */
    const { currencyId } = listItem.dataset;
    const { amount, currencyInputId, currenciesArray } = this.state;

    /* get name to transfer to state, from ID : */
    /* we search in array element with id given by clicked element and get its name */
    const { currencyName } = currenciesArray.find((el) => el.id === currencyId);

    /* get rate from API */
    const rate = await this.getConversion(currencyInputId, currencyId);

    /* calculate final amount */
    const computed = this.compute(rate, amount);

    /* update state */
    this.setState(() => ({ rate, computed, currencyName, currencyId }));

    /* store selected ID */
    localStorage.setItem('selectedCurrency', currencyId);
  }

  setAmount = (e) => {
    /* target is "amount" input */
    const amount = e.target.value;

    /* get rate from state */
    const { rate } = this.state;
    const computed = this.compute(rate, amount);
    this.setState(() => ({ amount, computed }));
  }

  /* calculate result with 3 after comma */
  compute = (a, b) => (a * b).toFixed(3);

  setFilter = (e) => {
    /* e.target.value is input element for filtering */
    const filter = e.target.value;
    console.log('filter', filter);
    const filteredCurrencies = this.filterCurrencies(filter);
    this.setState(() => ({ filteredCurrencies }));
  }

  filterCurrencies = (str) => {
    const { currenciesArray } = this.state;
    const regex = new RegExp(`.*${str}.*`, 'i');
    console.log(regex);
    const filteredCurrencies = currenciesArray.filter((el) => regex.test(el.currencyName));
    console.log(filteredCurrencies);
    return filteredCurrencies;
  }

  render() {
    const { filteredCurrencies, amount, currencyInputName, currencyName, computed, currencyId } = this.state;
    return (
      <>
        <form className="converter">
          <div className="converter__header">
            <h1 className="converter__title">Currency Converter</h1>
            {/* input that changes amount to convert  */}
            <input
              className="converter__input converter__amount"
              id="amountInput"
              type="number"
              defaultValue={amount}
              min="0"
              onChange={this.setAmount}
            />
            {/* input that changes currency to convert */}
            <input className="converter__input" type="text" id="currencyInput" defaultValue={currencyInputName} />
          </div>
          <CurrencyList
            /* We filter currency dictionary before sending to Component */
            currencies={filteredCurrencies}
            setResult={this.setResult}
            setFilter={this.setFilter}
            itemToHighlight={currencyId}
          />
          <ResultBox data={{ currencyName, computed }} />
        </form>
      </>
    );
  }
}

CurrencyConverter.propTypes = PropTypes.shape({
  amount: PropTypes.number.isRequired,
  currencyInputName: PropTypes.string.isRequired,
  currencyInputId: PropTypes.string.isRequired,
  currencyName: PropTypes.string.isRequired,
  currencyId: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  computed: PropTypes.number.isRequired,
}).isRequired;
