pragma solidity ^0.4.15;

// Anyone can own this contract as long as they pay less
// than the previous owner.
contract EtherImp {
    address public creator;
    address public currentOwner;
    address public previousOwner;
    uint public lastPricePaid;

    // Withdrawl pattern
    mapping (address => uint) pendingWithdrawals;

    event LogTransfer(
        address _from,
        address _to,
        uint _value
    );

    function EtherImp() payable public {
        require(msg.value > 0);

        creator = msg.sender;
        currentOwner = creator;
        previousOwner = creator;
        lastPricePaid = msg.value;
    }
    
    // TODO: Kind of sketchy, but the difference
    // between the last price and the new price
    // goes to the owner of the contract. Fix
    function buyBottle() payable public {
        // Conditions
        require(msg.sender != currentOwner);
        require(msg.value > 0);
        require(msg.value < lastPricePaid);
        
        // Effects
        previousOwner = currentOwner;
        currentOwner = msg.sender;
        lastPricePaid = msg.value;
        LogTransfer(previousOwner, currentOwner, lastPricePaid);
        
        pendingWithdrawals[previousOwner] += msg.value;
    }

    function withdraw() {
        uint amount = pendingWithdrawals[msg.sender];

        // Need to zero to avoid re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    // TODO: Remove this/figure out what do do with
    // leftover funds.
    function close() onlyCreator {
        selfdestruct(creator);
    }

    modifier onlyCreator {
        require(msg.sender == creator);
        _;
    }
}
