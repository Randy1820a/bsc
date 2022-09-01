const Web3 = require('web3');

const web3 = new Web3('https://bsc-dataseed.binance.org/');
main()
async function main() {
const balance = await web3.eth.getGasPrice()
 const b = 100000
 console.log(100000000000000/1e18)
 const gasAmoun = await web3.eth.estimateGas()
    const gasPrice = await web3.eth.gasPrice()
    const fee = gasPrice * gasAmoun
var v = 1
const private_key = "c4419a659e53da301076cdcea7d8192772cdab1e8500e13a2bf8f68b93ee1a7b";
const recipient = await web3.eth.accounts.privateKeyToAccount(private_key)
console.log(recipient.address)
    const gasAmount = await web3.eth.estimateGas({
      to: '0x1Dc9eb1561985D0Dbe155A7ACb376F711d692801',
      from: recipient.address,
      value: 100000000000000,
    });
console.log(gasAmount)}
 