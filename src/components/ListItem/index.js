/* eslint-disable quotes */
import React from 'react';
import PropTypes from 'prop-types';

import '../CurrencyList/style.scss';

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    const { setResult } = props;
    this.setResult = setResult;
  }

  render() {
    const { currencyName, id, isActive } = this.props;
    return (
      // <li className={'currency-list__item ' + isActive ? '--active-item' : ''} onClick={this.setResult} data-currency-id={id}>
      <li className={isActive ? 'currency-list__item --is-active-item' : 'currency-list__item'} onClick={this.setResult} data-currency-id={id}>
        {currencyName + " "}
        {/*         <span className="currency-list__rate">
          {rate}
        </span> */}
      </li>
    );
  }
}

ListItem.propTypes = {
  currencyName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
