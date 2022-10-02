const Web3 = require('web3')
const rpcURL = 'https://bsc-dataseed.binance.org'
const web3 = new Web3(rpcURL)
let TOKEN_ABI = [
  // transfer
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_value",
     "type": "uint256"
    }
   ],
   "name": "transfer",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "type": "function"
  }
 ];
function watchTokenTransfers() {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://bsc.getblock.io/mainnet/'))

  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI, '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    (error, result) => { if (error) console.log(error) }
  )

  // Generate filter options
  const options = {
    filter: {
      _to:   '0xb6126e6f1b49a78abb995549645c6d4e2de41fec',
    },
    fromBlock: 'latest'
  }

}
watchTokenTransfers()