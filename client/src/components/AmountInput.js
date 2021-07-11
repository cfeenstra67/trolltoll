import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

import * as priceConverter from '../lib/priceConverter'


class AmountInput extends React.Component {

  state = { currencies: ["ETH", "WEI", "USD"], title: "USD", value: 0, valueWei: 0 }

  getStepArgs() {
    if (this.state.title === "WEI") {
      return { defaultValue: "0", step: "1" };
    }
    return { defaultValue: "0.00", "step": "0.01" };
  }

  render() {
    return (
      <InputGroup>
        <FormControl
          type="number"
          placeholder="Enter Prize Value"
          defaultValue="0"
          onChange={(evt) => {
            priceConverter.getWeiValue(evt.target.value, this.state.title).then((price) => {
              this.setState({ value: evt.target.value, valueWei: price })
            });
          }}
          data-value-wei={this.state.valueWei.toString(10)}
          {...this.getStepArgs()}
        />
        <DropdownButton
          as={InputGroup.Prepend}
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

export default AmountInput;
