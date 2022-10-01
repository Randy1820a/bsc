const Web3 = require('web3')
const rpcURL = 'https://bsc-dataseed.binance.org'
const web3 = new Web3(rpcURL)

let tokenAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
let walletAddress = "0xdD440e8eCA5F1F3e6D5ffE903148EFB374942df2";

// The minimum ABI to get ERC20 Token balance
let minABI = [
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
  
let contract = new web3.eth.Contract(minABI,tokenAddress);
async function getBalance() {
  balance = await contract.methods.balanceOf(walletAddress);
  return balance;
}

console.log(getBalance());