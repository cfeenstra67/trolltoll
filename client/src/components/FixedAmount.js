import React from 'react'

import { getValue } from '../lib/priceConverter'


class FixedAmount extends React.Component {

  state = { loading: true, value: null }

  loadValue() {
    if (!this.state.loading) {
      this.setState({ loading: true, value: null });
    }

    getValue(this.props.weiValue, "WEI", this.props.currency)
      .then((value) => {
        this.setState({ loading: false, value: value })
      })
  }

  componentDidMount() {
    this.loadValue();
  }

  render() {
    let value;

    if (this.state.loading) {
      value = "---";
    } else if (this.props.includeUnit) {
      value = this.state.value.toString() + " " + this.props.currency;
    } else {
      value = this.state.value.toString();
    }

    return value;
  }

}

export default FixedAmount;
