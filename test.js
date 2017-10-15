//
// test.js
// simple code to deploy a single solidity contract on testrpc.
// the contract is deployed from the first account.
// 
// usage: node deploy.js path-to-abi deployed-address
//
// returns: deployed contract address on success

const fs = require('fs');
const Web3 = require('web3');
const assert = require('assert');

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

web3.eth.getAccounts().then((accounts) => {
    return accounts;   
}).then((accounts) => {
    // TODO: Make these tests work regardless of contract state (?)
    contract.methods.creator().call().then((account) => {
        assert(accounts[0] == account, 'creator is the first account');
    });        

    web3.eth.getBalance(accounts[0]).then((balance) => {
        console.log(web3.utils.fromWei(balance, 'ether'));
    });

    contract.methods.buyBottle().send({
        from: accounts[2],
        value: web3.utils.toWei('0.89', 'ether'),
        gas: 4700000
    }).on('error', (e) => { 
        console.error(e); 
        assert.fail('bottle could not be purchased');
    }).on('receipt', function(receipt) {
        myContract.methods.currentOwner().call().then((account) => {
            assert(accounts[2] == account, 'owner is now someone else');                    
        });     
        web3.eth.getBalance(accounts[0]).then((balance) => {
            console.log(balance);
        });   
    });
});
