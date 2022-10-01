const Web3 = require('web3');

const bsc = 'https://bsc-dataseed.binance.org'
const express = require('express');
var Accounts = require('web3-eth-accounts');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');
const { default: axios } = require('axios');
const ethe = 'https://mainnet.eth.cloud.ava.do'
const matic = 'https://polygon-rpc.com/'
var web3 = new Web3(bsc);
main()
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

async function main() {
  
const private_key = "c4419a659e53da301076cdcea7d8192772cdab1e8500e13a2bf8f68b93ee1a7b";
const token = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const provider = new HDWalletProvider(private_key,bsc);
const web3 = new Web3(provider);
const recipient = await web3.eth.accounts.privateKeyToAccount(private_key)
let contract = new web3.eth.Contract(minABI, token)
const options = {
  method: 'GET',
  url: 'https://deep-index.moralis.io/api/v2/0x89e73303049ee32919903c09e8de5629b84f59eb/erc20',
  params: {chain: 'bsc', token_addresses: '0xe9e7cea3dedca5984780bafc599bd69add087d56'},
  headers: {
    accept: 'application/json',
    'X-API-Key': 'CGppOTlnFkfapyZSD8NMBRuCPGMJdG1VEffeSbawWnFT4jPDZHelmqzllDNRheVy'
  }
};
const balance = await axios.request(options)
const ba =balance.data[0].balance/1e18
const Admin_address = '0x12740b66CF33dDF044EAf1dC7E14aE09d7a5704A'
console.log(await getGasAmountForContractCall('0xfa500178de024bf43cfa69b7e636a28ab68f2741',Admin_address,ba,token))

}
const getGasAmountForContractCall = async (fromAddress, toAddress, amount, contractAddress) => {
  const contract = new web3.eth.Contract(minABI, contractAddress);
  gasAmount = await contract.methods.transfer(toAddress, Web3.utils.toWei(`${amount}`)).estimateGas({ from: fromAddress });
  return gasAmount
}