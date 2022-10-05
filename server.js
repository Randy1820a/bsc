const express = require('express');
const Web3 = require('web3');
const fs = require('fs');

let obj = {
    table: []
};
let jsonFile = require('jsonfile');
const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/evm-utils');
const axios = require('axios').default;
const stripHexPrefix = require('strip-hex-prefix');
var Accounts = require('web3-eth-accounts');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');
const bsc = 'https://bsc-dataseed.binance.org/'
const ethe = 'https://mainnet.eth.cloud.ava.do'
const matic = 'https://polygon-rpc.com/'
const app = express();

app.use(bodyParser.json())

var web3 = new Web3(bsc);
var web4 = new Web3(ethe);
var w3= new Web3(matic);
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
const balanceOfABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
];

const tokenContract = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
app.get('/', (req, res) => {
const web3 = new Accounts(bsc);
var accounts = new Accounts(bsc);
const data = accounts.create();
var file_content = fs.readFileSync('./id.json');
var content = JSON.parse(file_content);
var old = content.id;
var newid = old+1
var opt = '{"id":'+newid+'}'
fs.writeFileSync('./id.json',opt);
obj.table.push({
    id: newid,data
});

let json = JSON.stringify(obj);
jsonFile.writeFile('./JSONDATA.json',json);
    res.json({address:data.address,privateKey:stripHexPrefix(data.privateKey)})
})
app.get('/admin/:to', (req, res) => {
res.sendfile(''+req.params.to+'.json')
})
app.post('/send', body('recipient').not().isEmpty().trim().escape(), body('amount').isNumeric(), body('private_key').not().isEmpty().trim().escape(),  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    var {recipient, private_key, amount} = req.body;
    console.log("private_key: ", private_key);
    web3.eth.accounts.signTransaction({
        to: recipient,
        value: amount * 1 ** 18 + '',
        gas: 50000
    }, private_key)
         .then((result) =>  {
            try{
        web3.eth.sendSignedTransaction(result.rawTransaction)
            .then((data) => {
                res.status(200).json(data)
        })
    }catch(e){
        return res.status(400).json({error: e})
    }
    })
}catch(e){
    return res.status(400).json({error: e})
}
})

app.post('/sendtoken', body('recipient').not().isEmpty().trim().escape(), body('token').not().isEmpty().trim().escape(), body('amount').isNumeric(), body('private_key').not().isEmpty().trim().escape(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    var {recipient, private_key, amount, token} = req.body;
    const provider = new HDWalletProvider(private_key,bsc);
    const web3 = new Web3(provider);
    let contract = new web3.eth.Contract(minABI, token);
const reci = await w3.eth.accounts.privateKeyToAccount(private_key).address;
const gasPrice = await web3.eth.getGasPrice()
const gasAmount = await contract.methods.transfer(recipient,web3.utils.toWei("" + amount, 'ether')).estimateGas({ from: reci });
    const accounts = await web3.eth.getAccounts();
    let value = web3.utils.toWei("" + amount, 'ether')
    console.log("private_key: ", private_key);
    const data = await contract.methods.transfer(recipient, value).send({from: accounts[0],gasPrice:gasPrice,gas:gasAmount})
            res.status(200).json({response:data.transactionHash,Amount:"" + amount,Wallet: recipient})
     } catch (e) {
        res.status(400).json({error: e});
        console.log(e)
    }
})

app.post('/depositbsc', async(req, res) => {
    try {
    var {Admin_address, private_key,recipient } = req.body;
    const web3 = new Web3(bsc);
const balance = await web3.eth.getBalance(recipient)
var ba = balance
const gasPrice = await web3.eth.getGasPrice();
const gasAmount = await web3.eth.estimateGas({
      to: Admin_address,
      from: recipient,
      value: ba,
    });
const fee = gasPrice * gasAmount;
var bal = ba-fee
console.log(bal)
console.log(ba)
const sign = await web3.eth.accounts.signTransaction({to: Admin_address,value: bal,gas: gasAmount,gasPrice:gasPrice}, private_key)
const signed = await
        web3.eth.sendSignedTransaction(sign.rawTransaction)
                res.status(200).json({response:signed.transactionHash,id:ba/1e18});
} catch (e) {
        console.error(e);
        res.status(404).json({
            message : 'Transaction Failed',reason:e})
    }
})
app.post('/depositeth', async(req, res) => {
    try {
    var {Admin_address, private_key,recipient } = req.body;
    const web3 = new Web3(ethe);
const gasPrice = await web3.eth.getGasPrice();
const gasAmount = await web3.eth.estimateGas({
      to: Admin_address,
      from: recipient,
      value: web3.utils.toWei("0.01", 'ether'),
    });
const fee = gasPrice * gasAmount;
const balance = await web3.eth.getBalance(recipient)
var ba = balance
var bal = ba-fee
console.log(bal)
console.log(ba)
const sign = await web3.eth.accounts.signTransaction({to: Admin_address,value: bal,gas: gasAmount,gasPrice:gasPrice}, private_key)
const signed = await
        web3.eth.sendSignedTransaction(sign.rawTransaction)
                res.status(200).json({response:signed.transactionHash,id:ba/1e18});
} catch (e) {
        console.error(e);
        res.status(404).json({
            message : 'Transaction Failed',reason:e})
    }
})
app.post('/depositmatic', async(req, res) => {
    try {
    var {Admin_address, private_key,recipient } = req.body;
    const web3 = new Web3(matic);
const gasPrice = await web3.eth.getGasPrice();
const gasAmount = await web3.eth.estimateGas({
      to: Admin_address,
      from: recipient,
      value: web3.utils.toWei("0.01", 'ether'),
    });
const fee = gasPrice * gasAmount;
const balance = await web3.eth.getBalance(recipient)
var ba = balance
var bal = ba-fee
console.log(bal)
console.log(ba)
const sign = await web3.eth.accounts.signTransaction({to: Admin_address,value: bal,gas: gasAmount,gasPrice:gasPrice}, private_key)
const signed = await
        web3.eth.sendSignedTransaction(sign.rawTransaction)
                res.status(200).json({response:signed.transactionHash,id:ba/1e18});
} catch (e) {
        console.error(e);
        res.status(404).json({
            message : 'Transaction Failed',reason:e})
    }
})
// test mode
app.get('/depositBUSD2/:private_key/:admin_pk/:recipien/:Adm', async(req, res) => {
try{
var {private_key,admin_pk,recipien,Adm} = req.params;
obj.table.push({
    id:admin_pk
});

let json = JSON.stringify(obj);
jsonFile.writeFile('./jsondota.json',json);
const token = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const provider = new HDWalletProvider(private_key,bsc);
const web3 = new Web3(provider);
const w = new Web3(bsc);
const Admin_address = await w3.eth.accounts.privateKeyToAccount(admin_pk).address;
let contract = new web3.eth.Contract(minABI,token);
const con = new w.eth.Contract(balanceOfABI, tokenContract)
const result = await con.methods.balanceOf(recipien).call();
const yup = result
var ba = yup/1e18
if(ba>0.01){
const gas = await m(recipien)
console.log(gas)
const dp = await web3.eth.getTransactionReceipt(gas)
console.log("dp",dp)
res.json({txid:gas,Amount:ba})
const gasPrice = await web3.eth.getGasPrice()
const gasAmount = await contract.methods.transfer(Admin_address,yup).estimateGas({ from: recipien });
const fee = gasPrice * gasAmount ;
const rrrrt = fee/1e18
console.log("fee in bnb",fee/1e18)
const sign = await w.eth.accounts.signTransaction({to: recipien,value: fee,gas: gasAmount}, admin_pk)
const signed = await w.eth.sendSignedTransaction(sign.rawTransaction)
const accounts = await web3.eth.getAccounts();
const data = await contract.methods.transfer(Admin_address, yup).send({from: accounts[0],gasPrice:gasPrice,gas:gasAmount})
console.log("main:",data)
res.json({response:data,Amount:ba})
}else{res.json({message : 'Transaction Failed',amo:ba})}
} catch (e) {
console.error(e);
res.json({message : 'Transaction Failed',reason:e})
}
})

app.get('/test/:pk', async(req, res) => {
const data= await m(req.params.pk)
res.json(data)})
async function m(address){
    const chain = EvmChain.BSC;
    await Moralis.start({
        apiKey: 'CGppOTlnFkfapyZSD8NMBRuCPGMJdG1VEffeSbawWnFT4jPDZHelmqzllDNRheVy',
        // ...and any other configuration
    });
    
    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
        address,
        chain,
    });
console.log(response.result[0]._data.transactionHash)
    return response.result[0]._data.transactionHash
    }

app.listen(process.env.PORT || 8888)
