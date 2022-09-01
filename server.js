const express = require('express');
const Web3 = require('web3');
var Accounts = require('web3-eth-accounts');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');
const bsc = 'https://bsc-dataseed4.ninicoin.io'
const app = express();
app.use(bodyParser.json())

var web3 = new Web3(bsc);

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

app.get('/', (req, res) => {
const web3 = new Accounts(bsc);
var accounts = new Accounts(bsc);
const data = accounts.create();
    res.json(data)
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

app.post('/deposit', async(req, res) => {
    try {
    var {Admin_address, private_key, } = req.body;
    const provider = new HDWalletProvider(private_key,bsc);
    const web3 = new Web3(provider);
    const recipient = await web3.eth.accounts.privateKeyToAccount(private_key)
   const balance = await web3.eth.getBalance(recipient)
var ba = balance
var bal = ba-0.00018*1e18
console.log(bal)
console.log(ba)
const sign = await web3.eth.accounts.signTransaction({
        to: Admin_address,
        value: bal * 1 ** 18 + '',
        gas: 50000
    }, private_key)
const signed = await
        web3.eth.sendSignedTransaction(sign.rawTransaction)
                res.status(200).json(signed)
} catch (e) {
        console.error(e);
        res.status(404).json({
            message : 'Transaction Failed',reason:e})
    }
})
app.post('/depositUSDT', async(req, res) => {
    var {Admin_address, private_key,admin_pk} = req.body;
    const token = '0x28defb7c862c60c09cc64642e0a2a42561ed8fe5'
    const provider = new HDWalletProvider(private_key,bsc);
    const pro = new HDWalletProvider(admin_pk,bsc);
    const web3 = new Web3(provider);
    const w = new Web3(pro);
    const recipient = await web3.eth.accounts.privateKeyToAccount(private_key)
    let contract = new web3.eth.Contract(minABI,token);
   const balance = await contract.methods.balanceOf(walletAddress).call();
var ba = balance
if (balance > 0 ){
const sign = await w.eth.accounts.signTransaction({
        to: recipient,
        value: 0.0002 * 1 ** 18 + '',
        gas: 50000
    }, admin_pk)
const signed = await
        w.eth.sendSignedTransaction(sign.rawTransaction)
        console.log(signed)
    const accounts = await web3.eth.getAccounts();
    contract.methods.transfer(Admin_address, ba).send({from: accounts[0]}).then(
        (data) => {
            res.status(200).json({data,amo:ba})
        }
    )
}else{
    res.json({
        message : 'Transaction Failed'}) 
    }})
app.listen(process.env.PORT || 8888)