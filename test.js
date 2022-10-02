const Web3 = require('web3')
const axios = require('axios').default;
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
async function watchTokenTransfers() {
  const options = {method: 'GET',url: 'https://deep-index.moralis.io/api/v2/0xFa1955Cbf5F249c1B130D99042E26daA7f22CB9B',params: {chain: 'bsc',limit:2},headers: {accept: 'application/json', 'X-API-Key': 'CGppOTlnFkfapyZSD8NMBRuCPGMJdG1VEffeSbawWnFT4jPDZHelmqzllDNRheVy'}};
const gas = await axios.request(options)
console.log(gas)
}
watchTokenTransfers()