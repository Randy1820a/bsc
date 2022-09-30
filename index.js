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
const balance= await axios.get('https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xe9e7cea3dedca5984780bafc599bd69add087d56&address='+recipient.address+'&tag=latest&apikey=ZDJUWT5FJNV3WKXXEGKJJES8Z65I17FNTG')
console.log(balance.data.result/1e18)}
 

