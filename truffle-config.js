module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    main: {
      host: "192.168.1.111",
      port: 8545,
      network_id: 1,
      timeoutBlocks: 1000,
      gas: 2000000, // cap
      gasPrice: 15000000000
    }
  },
  compilers: {
    solc: {
      version: "0.8.4"
    }
  }
};
