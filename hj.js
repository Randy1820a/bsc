

const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/evm-utils');

const address = '0xFa1955Cbf5F249c1B130D99042E26daA7f22CB9B';
//gg
const chain = EvmChain.BSC;
async function m(){
await Moralis.start({
    apiKey: 'CGppOTlnFkfapyZSD8NMBRuCPGMJdG1VEffeSbawWnFT4jPDZHelmqzllDNRheVy',
    // ...and any other configuration
});

const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    address,
    chain,
});
console.log(response.result[0]._data.hash);
}
m()