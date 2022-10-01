const Web3 = require('web3');

const bsc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
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
  
const private_key = "a80c0a580f71d9af91e5cbfd15fb9d2beb2273ff7c418b01a87fdb92f99a0f59";
const token = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
const provider = new HDWalletProvider(private_key,bsc);
const web3 = new Web3(provider);
const recipient = await web3.eth.accounts.privateKeyToAccount(private_key).address
let contract = new web3.eth.Contract(minABI, token)
const options = {
  method: 'GET',
  url: 'https://deep-index.moralis.io/api/v2/0xe9e7cea3dedca5984780bafc599bd69add087d56/erc20',
  params: {chain: 'bsc',token_},
  headers: {
    accept: 'application/json',
    'X-API-Key': 'CGppOTlnFkfapyZSD8NMBRuCPGMJdG1VEffeSbawWnFT4jPDZHelmqzllDNRheVy'
  }
};
const balance = await axios.request(options)
const ba =balance.data[0].balance/1e18
console.log(ba)
const Admin_address = '0x12740b66CF33dDF044EAf1dC7E14aE09d7a5704A'
const gasAmount = await contract.methods.transfer(Admin_address,ba).estimateGas({recipient}).then(res=>{
    console.log(res);
})
console.log(gasAmount)}