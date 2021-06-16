import fs from 'fs';
import moment from 'moment';
import { config } from 'dotenv';
import { resolve } from 'path';
import fetch from 'node-fetch';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const VERBOSE = false;
const PATH_TO_ENV = (fs.existsSync(resolve(__dirname, './.env')) &&
    fs.lstatSync(resolve(__dirname, './.env')).isFile())
    ? resolve(__dirname, './.env')
    : '/Users/mark.phillips/Developer/eth-world/solidity-ts-tutorial/.env';

config({ path: PATH_TO_ENV });
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL || '';
const ETH_PUBLIC_KEY = process.env.ETH_PUBLIC_KEY || '';
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY || '';

if (VERBOSE && ALCHEMY_API_URL && ETH_PUBLIC_KEY) {
    console.log(`Loading environment variables:${PATH_TO_ENV}`);
    console.log(`ALCHEMY_API:${ALCHEMY_API_URL}`);
    console.log(`ETH PUBLIC/PRIVATE KEY:${ETH_PUBLIC_KEY}/${ETH_PRIVATE_KEY}`);
};

const web3 = createAlchemyWeb3(ALCHEMY_API_URL);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const local_contract = require(resolve(__dirname, `../artifacts/contracts/TemplateToken_v2.sol/ChuckNorrisToken.json`));
if (local_contract) {
    console.log(`Loaded:${local_contract.contractName} (${local_contract.sourceName})`);
}
const contract_address = `0xd69966603a28c3876A5Ce6FA4722172ADb31276b`;

const randomDescription = async () => {
    const url = 'https://api.chucknorris.io/jokes/random'
    const response = await fetch(url, { method: 'GET' });

    let json, joke;
    if (response.ok) {
        json = await response.json();
        joke = json.value;
    }

    VERBOSE && console.log(`[${timestamp}] Fetched new Chuck Norris Joke:${joke}`);
    return joke;
};

const updateDescription = async (contract: any, newDescription: string) => {
    console.log(`[${timestamp}] Updating contract(${contract.contractName}):`);
    const nonce = await web3.eth.getTransactionCount(ETH_PUBLIC_KEY, 'latest');
    const gasEstimate = await contract.methods.updateDescription(newDescription).estimateGas();

    if (!contract || !newDescription) {
        return;
    } else {
        const tx = {
            'from': ETH_PUBLIC_KEY,
            'to': contract_address,
            'nonce': nonce,
            'gas': gasEstimate,
            'data': contract.methods.updateDescription(newDescription).encodeABI()
        };
        
        console.log(`[${timestamp}] Computing transaction costs:`);
        console.log(tx);
        console.log(`[${timestamp}] Signing the transaction => `);    
        const signPromise = web3.eth.accounts.signTransaction(tx, ETH_PRIVATE_KEY);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signPromise.then((signedTx: any) => {
            console.log(`[${timestamp}] Signed Transaction:`);
            console.log(Object.keys(signedTx));
            console.log(signedTx);
            void web3.eth.sendSignedTransaction(signedTx.rawTransaction, (e, hash) => {
                if (!e) console.log(`[${timestamp}] Tx Hash => ${hash}. ` +
                    `Verify transaction on Alchemy ` +
                    `(https://dashboard.alchemyapi.io/explorer?time_min=1622580302973&time_range_preset=last5Minutes).`)
                else console.error(`[${timestamp}] Something went wrong with transmissing the transaction:`, e);
            })
        }).catch((e) => {
            console.error(`[${timestamp}] UpdateDescription signPromise failed:`, e);
        });
    };
};

const timestamp = moment().format('YYYYMMDD-HHmmssSS');

(async () => {
    console.log(`[${timestamp}] Loading local and remote contract => `);
    console.log(`[${timestamp}] Contract:${contract_address} (keys) => `);
    console.log(Object.keys(local_contract));

    const global_contract = new web3.eth.Contract(local_contract.abi, contract_address);    
    
    console.log(`[${timestamp}] Application start contract value => `);
    let description = await global_contract.methods.description().call();
    console.log(`[${timestamp}] ${contract_address}(desc): ${description}`);        
    
    const desc = await randomDescription();
    await updateDescription(global_contract, desc);
    
    console.log(`[${timestamp}] Application updated contract value => `);
    description = await global_contract.methods.description().call();
    console.log(`[${timestamp}] ${contract_address}(desc): ${description}`);
})();

(async () => {
    
    console.log(await randomDescription());

});
