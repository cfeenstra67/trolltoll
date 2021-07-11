import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import InputGroup from 'react-bootstrap/InputGroup'

import { getValue } from '../lib/priceConverter'


class Amount extends React.Component {

  state = { currencies: ["ETH", "WEI", "USD"], title: "USD", loading: false, value: null }

  getCurrentValue() {
    this.setState({ loading: true });
    return getValue(this.props.weiValue, "WEI", this.state.title)
      .then((result) => {
        this.setState({ loading: false, value: result });
      })
  }

  formatDecimal(value, n) {
    n = n || 2;
    let magnitude = Math.pow(10, n);
    return (Math.round(value * magnitude) / magnitude).toFixed(n);
  }

  formatValue() {
    if (this.state.value === null || this.state.value === undefined) {
      return "---";
    }
    switch(this.state.title) {
      case "WEI":
        return this.state.value.toString(10);
      case "ETH":
        return this.formatDecimal(this.state.value, 4);
      case "USD":
        return this.formatDecimal(this.state.value, 2);
      default:
        throw new Error("Invalid currency " + this.state.title);
    }

  }

  componentDidMount() {
    this.getCurrentValue();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.title !== this.state.title) {
      this.getCurrentValue();
    }
  }

  render() {
    let propsCopy = Object.assign({}, this.props);
    if (propsCopy.weiValue) {
      delete propsCopy["weiValue"];
    }
    return (
      <InputGroup {...propsCopy}>
        <InputGroup.Text className="amount-input">
          {this.state.loading ? (
            <>
              {"---"}
            </>
          ) : (
            <>
              {this.formatValue()}
            </>
          )}
        </InputGroup.Text>
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-primary"
          title={this.state.title}
        >
          {this.state.currencies.map((currency) => {
            return <Dropdown.Item key={currency} onClick={() => {
              this.setState({ title: currency });
            }}>{currency}</Dropdown.Item>
          })}
        </DropdownButton>
      </InputGroup>
    )
  }

}

export default Amount;
