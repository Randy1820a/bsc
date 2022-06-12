const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');

const app = express();
app.use(bodyParser.json())

var web3 = new Web3('https://bsc-dataseed.binance.org');

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
    res.status(200).json({
        message: "Hello World !"
    })
})

app.post('/sendbsc', body('recipient').not().isEmpty().trim().escape(), body('amount').isNumeric(), body('private_key').not().isEmpty().trim().escape(),  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    var {recipient, private_key, amount} = req.body;
    web3.eth.accounts.signTransaction({
        to: recipient,
        value: amount * 1 ** 18 + '',
        gas: 100000
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
    const provider = new HDWalletProvider(private_key, `https://bsc-dataseed.binance.org`);
    web3 = new Web3(provider);
    let contract = new web3.eth.Contract(minABI, token);
    const accounts = await web3.eth.getAccounts();
    let value = new BigNumber(amount * 1 ** 18);
    contract.methods.transfer(recipient, value).send({from: accounts[0]}).then(
        (data) => {
            res.status(200).json(data)
        }
    )
    }catch(e){
        return res.status(400).json({error: e})
    }
})

app.listen(process.env.PORT || 3000)
