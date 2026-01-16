// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

contract MockERC20 {

    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint8 public decimals = 18;
    mapping(address to => uint256 amount) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor(string memory _name, string memory _symbol) {  
        name = _name;
        symbol = _symbol;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool){
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

}