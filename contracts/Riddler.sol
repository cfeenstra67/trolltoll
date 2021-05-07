pragma solidity >=0.7.0 <0.9.0;

import "./Riddle.sol";


contract Riddler {

    address public creator;
    uint public creatorFeePercent;

    event RiddleCreated(string riddle, address contractAddress);

    constructor(uint creatorFeePercentValue) {
        creator = msg.sender;
        creatorFeePercent = creatorFeePercentValue;
    }

    function destroy() public {
        require(msg.sender == creator, "Access denied.");
        selfdestruct(payable(creator));
    }

    function riddleMeThis(
        string memory riddle,
        string memory answer,
        uint guessCostValue,
        string memory salt
    ) public returns(address) {
        Riddle newContract = new Riddle(
            riddle,
            answer,
            guessCostValue,
            creatorFeePercent,
            creator,
            salt
        );
        address contractAddress = address(newContract);
        emit RiddleCreated(riddle, contractAddress);
        return contractAddress;
    }

}
