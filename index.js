const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed.binance.org/');
main()
async function main(){
const private_key = "c4419a659e53da301076cdcea7d8192772cdab1e8500e13a2bf8f68b93ee1a7b";
 const balance = await web3.eth.accounts.privateKeyToAccount(private_key)
 const bae = await web3.eth.estimateGas()
 console.log(balance.address)
 console.log(bae)
var tx = {
    to: "0x1Dc9eb1561985D0Dbe155A7ACb376F711d692801",
    value: 0.1 * 10 ** 18 + '',
    gas: 2000000
}

web3.eth.accounts.signTransaction(tx, private_key)
.then((result) =>  {
    web3.eth.sendSignedTransaction(result.rawTransaction)
    .then((res) => {
        console.log(res)
    })
})}