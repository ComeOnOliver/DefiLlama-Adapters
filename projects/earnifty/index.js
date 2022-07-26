const sdk = require('@defillama/sdk');
const vaultContractABI = require("./abis/vault.json");
const { transformVelasAddress } = require('../helper/portedTokens');
const { unwrapUniswapLPs } = require('../helper/unwrapLPs');
const vaults_info = require('./vaults_info.json');


async function tvl(timestamp, block, chainBlocks) {
    const balances = {};
    for (const info of vaults_info) {
        const balance = ((await sdk.api.abi.call({
            abi: vaultContractABI,
            chain: 'velas',
            target: info.vault_address,
            params: [],
            block: chainBlocks['velas'],
        })).output);
        const transform = await transformVelasAddress();
        await unwrapUniswapLPs(
            balances,
            [{
                balance: balance,
                token: info.want_address
            }],
            chainBlocks['velas'],
            'velas',
            transform
        );
        }
    return balances;
};


module.exports = {
    misrepresentedTokens: true,
    methodology: 'Count the token amount in each vault.',
    velas: {
        tvl,
    }
}; 