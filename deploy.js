//
// deploy.js
// simple code to deploy a single solidity contract on testrpc.
// the contract is deployed from the first account.
// 
// usage: node deploy.js path-to-abi path-to-bytecode
//
// returns: deployed contract address on success

const fs = require('fs');
const Web3 = require('web3');

const LOCALHOST_NODE = 'http://localhost:8545';

if (process.argv.length <= 3) {
    console.log(`Usage: node ${__filename} path-to-abi path-to-bytecode`);
    process.exit(-1);
}

const abiPath = process.argv[2];
const byteCodePath = process.argv[3];

var abi = fs.readFileSync(abiPath, 'utf-8');
var byteCode = fs.readFileSync(byteCodePath);
var abiDefinition = JSON.parse(abi);

const web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(LOCALHOST_NODE));
var contract = new web3.eth.Contract(abiDefinition);

web3.eth.getAccounts().then((accounts) => {
    return accounts[0];   
}).then((account) => {
    contract.deploy({
        data: byteCode,
        arguments: null
    }).send({
        from: account,
        value: web3.utils.toWei('1', 'ether'),    
        gas: 4700000
    }).on('error', (e) => { 
        console.error(e);
        process.exit(-1);
    }).on('transactionHash', function(hash){
        // contract waiting to be mined...
    }).on('receipt', (receipt) => {
        console.log(receipt.contractAddress);
        fs.writeFileSync('build/DEPLOYED_ADDRESS', receipt.contractAddress);    
    });
});

