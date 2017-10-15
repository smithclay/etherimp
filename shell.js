//
// shell.js
// simple code to open an interactive shel to a deployed contract on testrpc
// 
// usage: node shell.js path-to-abi deployed-address
//
// returns: deployed contract address on success

const fs = require('fs');
const Web3 = require('web3');
const repl = require('repl');
const LOCALHOST_NODE = 'http://localhost:8545';

if (process.argv.length <= 3) {
    console.log(`Usage: node ${__filename} path-to-abi deployed-address`);
    process.exit(-1);
}

const abiPath = process.argv[2];
const deployedAddress = process.argv[3];

var abi = fs.readFileSync(abiPath, 'utf-8');
var abiDefinition = JSON.parse(abi);

const web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(LOCALHOST_NODE));
var contract = new web3.eth.Contract(abiDefinition);
contract.options.address = deployedAddress;

console.log();
console.log(`starting shell with contract: ${abiPath}...`);
console.log(`contract deployed address: ${deployedAddress}`);
console.log('an instance of the contract is available in the `contract` variable');

var r = repl.start({prompt: '> '}).context.contract = contract;
