pragma solidity >=0.7.0 <0.9.0;


contract Riddle {
    
    address public creator;
    address public owner;
    uint public guessCost;
    uint public prize;
    uint public creatorFeePercent;

    string public riddleText;

    bytes32 public answerHash;
    bytes32 public answerSalt;
    
    string public answerText;
    bool public isAnswered;
    address public winner;

    event GuessEvent(string guessText, bool correct);

    constructor(
        string memory riddle,
        string memory answer,
        uint guessCostValue,
        uint creatorFeePercentValue,
        address creatorAddress,
        string memory salt
    ) payable {
        require(creatorFeePercentValue < 100, "Invalid creator fee.");
        owner = msg.sender;
        riddleText = riddle;
        answerSalt = sha256(bytes(salt));
        answerHash = sha256(abi.encodePacked(bytes(answer), answerSalt));
        guessCost = guessCostValue;
        creatorFeePercent = creatorFeePercentValue;
        prize = msg.value * 100 / (100 + creatorFeePercentValue);
        uint creationCost = msg.value - prize;
        creator = creatorAddress;
        payable(creator).transfer(creationCost);
    }

    function destroy() public {
        require(msg.sender == owner, "Access denied.");
        selfdestruct(payable(owner));
    }
    
    function guess(string memory guessText) public payable returns (bool) {
        require(!isAnswered, "Sorry, too late!");
        require(msg.sender != owner, "You know the answer, that's no fair!");
        require(msg.value == guessCost, "Invalid guess amount.");
        // pay the owner the guess cost
        uint ownerShare = msg.value * 100 / (100 + creatorFeePercent);
        uint creatorShare = msg.value - ownerShare;
        payable(owner).transfer(ownerShare);
        payable(creator).transfer(creatorShare);
        // check that this address can guess
        bytes32 guessHash = sha256(abi.encodePacked(bytes(guessText), answerSalt));
        bool correct = guessHash == answerHash;
        emit GuessEvent(guessText, correct);
        if (correct) {
            // success!
            answerText = guessText;
            isAnswered = true;
            winner = msg.sender;
            payable(msg.sender).transfer(prize);
            return true;
        }
        return false;
    }

}
