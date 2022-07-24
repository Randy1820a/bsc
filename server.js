const express = require('express');
const { DigiByteService } = require('../Services/DigiByteService');

const router = express.Router();

const digiByteService = new DigiByteService();

router.get('/', (req, res) => {
  try {
    const wallet = DigiByteService.getNewWallet();
    res.json({ wallet });
  }catch(e){
      return res.status(400).json({error: e})
      
  }
    
})
router.post('/balance', async (req, res) => {
  try {
    const { address } = req.body;
    const balance = await digiByteService.getWalletBalance(address);
    res.json({
      balance,
    });
  }catch(e){
      return res.status(400).json({error: e})
      
  }
    
})
router.post('/deposit', async (req, res) => {
  try {
    const {
      address, my_address, privateKey,
    amount,} = req.body;
    const balance = await digiByteService.getWalletBalance(address);
    const result = await digiByteService.deposit(address, my_address, privateKey,amount);
    res.json({
      result,bal: balance 
    });
  }catch(e){
      return res.status(400).json({error: e})
      
  }
    
})

router.post('/send', async (req, res) => {
  try {
    const {
      address, my_address, privateKey, amount,
    } = req.body;
    const balance = await digiByteService.getWalletBalance(address);
    const result = await digiByteService.sendTransaction(address, my_address, privateKey, amount);
    res.status(200).json({result,balance});
      
  }catch(e){
      return res.status(400).json({error: e})
      
  }
    
})
router.post('/tx', async (req, res) => {
  try {
    const { address } = req.body;
    const transactions = await digiByteService.getIncommingTransactions(address);
    res.json({
      transactions,
    });
  }catch(e){
      return res.status(400).json({error: e})
      
  }
    
})

module.exports = router;
