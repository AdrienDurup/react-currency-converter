/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-useless-constructor */
import React from 'react';
import './style.scss';

export default class ResultBox extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { computed, currencyName } = this.props.data;
    console.log(computed, currencyName);
    return (
      <div className="result-box">
        <div className="result__rate">{computed}</div>
        <div className="result__name">{currencyName}</div>
      </div>
    )
  }
}
