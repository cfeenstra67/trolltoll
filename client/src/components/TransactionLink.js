
export default function TransactionLink({ txHash, networkId, ...props }) {
  switch(networkId) {
    case 1:
      return (
        <span {...props}>
          You may view the transaction{' '}
          <a href={"https://etherscan.io/tx/" + txHash}>
            here
          </a>.
        </span>
      )
    case 3:
      return (
        <span {...props}>
          You may view the transaction{' '}
          <a href={"https://ropsten.etherscan.io/tx/" + txHash}>
            here
          </a>.
        </span>
      )
    default:
      return (
        <span {...props}>Your transaction hash is: {txHash}.</span>
      )
  }
}
