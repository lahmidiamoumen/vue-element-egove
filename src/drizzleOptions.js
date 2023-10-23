import Haal from '../../brightGove-back/build/contracts/Haal.json'

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'HTTP',
      url: 'HTTP://127.0.0.1:8545'
    }
  },
  contracts: [Haal],
  polls: {
    accounts: 15000
  }
}

export default options
