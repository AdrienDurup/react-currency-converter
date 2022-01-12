/* eslint-disable max-len */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import './style.scss';
import ListItem from '../ListItem';

export default class CurrencyList extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("list mounted");
  }

  componentDidUpdate() {
    console.log("list updated");
  }

  render() {
    const { setResult, setFilter, currencies, itemToHighlight,filter,storedCurrencyId } = this.props;
    console.log("should highlight", itemToHighlight);
    const dictKeys = Object.keys(currencies);
    return (
      <ul className="list-container">
        {/* <li className="currency-list__item is-title">Currencies</li> */}
        <li className="currency-list__item has-filter">
          <input className="currency-list__filter" type="text" placeholder="Currency filter" onChange={setFilter} value={filter} />
        </li>
        {dictKeys.map((key) => {
          const el = currencies[key];
          return (
            <ListItem {...el} key={el.id} setResult={setResult} isActive={el.id === itemToHighlight} />
          );
        })}
      </ul>
    )
  }
}
