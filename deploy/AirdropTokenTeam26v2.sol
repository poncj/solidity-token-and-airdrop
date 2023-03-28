// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ITokenTeam26 {
    function transferFrom(address _from, address _to, uint256 _amount) external;
}

contract AirdropTokenTeam26 {
    // v2
    
    address public owner;
    
    ITokenTeam26 public token;

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = ITokenTeam26(_tokenAddress);
    }
    
    // NEED ALLOWANCE TO AirdropTokenTeam26 ADDRESS
    function airdropTokensFromAddressBalance(address[] memory _addressArray, uint256 _amount) public {
        for (uint256 i = 0; i<_addressArray.length; i++) {
            token.transferFrom(msg.sender, _addressArray[i], _amount);
        }
    }
}