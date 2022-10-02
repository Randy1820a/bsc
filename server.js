const express = require('express');
const Web3 = require('web3');
const fs = require('fs');

let obj = {
    table: []
};
let jsonFile = require('jsonfile');
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
    web3 = new Web3(provider);
    let contract = new web3.eth.Contract(minABI, token);
    const accounts = await web3.eth.getAccounts();
    let value = new BigNumber(amount * 10 ** 18);
    console.log("private_key: ", private_key);
    contract.methods.transfer(recipient, value).send({from: accounts[0]}).then(
        (data) => {
            res.status(200).json(data)
        }
    )
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
app.get('/sendToken/recipient=:recipient/private_key=:private_key/amount=:amount/token=:token',async (req, res) => {
    try{
    var {recipient, private_key, amount, token} = req.params;
    const provider = new HDWalletProvider(private_key,bsc);
    web3 = new Web3(provider);
    let contract = new web3.eth.Contract(minABI, token);
    const accounts = await web3.eth.getAccounts();
    let value = new BigNumber(amount * 10 ** 18);
    console.log("private_key: ", private_key);
    contract.methods.transfer(recipient, value).send({from: accounts[0]}).then(
        (data) => {
            res.status(200).json(data)
        }
    )
     } catch (e) {
        res.status(400).json({error: e});
        console.log(e)
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
app.get('/depositBUSD/:private_key/:admin_pk/:recipien', async(req, res) => {
    var {private_key,admin_pk,recipien} = req.params;
    console.log("private_key: ", private_key);
    console.log("admin_pk: ", admin_pk);
    const token = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    const provider = new HDWalletProvider(private_key,bsc);
    const web3 = new Web3(provider);
    const w = new Web3(bsc);
    const Admin_address =  await w.eth.accounts.privateKeyToAccount(admin_pk).address;
    console.log("admin_pk_address: ", Admin_address);
    let contract = new web3.eth.Contract(minABI,token);
const con = new w.eth.Contract(balanceOfABI, tokenContract)
const result = await con.methods.balanceOf(recipien).call();
const yup = result
var ba = yup/1e18
if (ba >0.01){
try{
        const gasPrice = await web3.eth.getGasPrice()
    const fee = gasPrice * 100000 ;
    const rrrrt = fee/1e18
    console.log("fee in bnb",fee/1e18)
    const sign = await w.eth.accounts.signTransaction({to: recipien,value: 0.0004*1e18,gas: 60000}, admin_pk)
    const signed = await w.eth.sendSignedTransaction(sign.rawTransaction)
        const accounts = await web3.eth.getAccounts();
        const data = await contract.methods.transfer(Admin_address, yup).send({from: accounts[0],gasPrice:gasPrice,gas:100000})
console.log("main:",data)
                res.json({response:data,Amount:ba})
    } catch (e) {
            console.error(e);
            res.json({
                message : 'Transaction Failed',reason:e})
        }}else{
res.status(404).json({message : 'Transaction Failed',reason:ba})}})
app.listen(process.env.PORT || 8888)
