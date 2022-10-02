


const address = '0xFa1955Cbf5F249c1B130D99042E26daA7f22CB9B';

const chain = EvmChain.BSC;
async function m(){
await Moralis.start({
    apiKey: 'test',
    // ...and any other configuration
});

const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    address,
    chain,
});
console.log(response.result[0]._data.hash);
}
m()