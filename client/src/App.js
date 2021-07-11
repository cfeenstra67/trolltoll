import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import TruffleContract from 'truffle-contract'
import RiddleContract from "./contracts/Riddle.json";
import RiddlerContract from "./contracts/Riddler.json";
import getWeb3 from "./getWeb3";
// We will create these two pages in a moment
import HomePage from './pages/HomePage'
import RiddlePage from './pages/RiddlePage'


class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, Riddler: null, Riddle: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RiddlerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RiddlerContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      let Riddler = TruffleContract(RiddlerContract);
      Riddler.setProvider(web3.currentProvider);

      let Riddle = TruffleContract(RiddleContract);
      Riddle.setProvider(web3.currentProvider);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        { 
          web3, 
          accounts,
          networkId,
          Riddler,
          Riddle,
          contract: instance
        },
        () => (this.onMount && this.onMount())
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  renderComponent = function(Component) { return (props) => 
    <Component app={this} {...props} />
  };

  onMount = function() {};

  resetHandlers = function() {
    this.onMount = function() {};
  };

  render() {
    this.resetHandlers();
    return (
      <Switch>
        <Route exact path="/" render={this.renderComponent(HomePage)} />
        <Route path="/:id" render={this.renderComponent(RiddlePage)} />
        <Redirect to="/" />
      </Switch>
    )
  };
}

export function getRiddleUrl(id) {
  return `${id}`;
}

export default App;
