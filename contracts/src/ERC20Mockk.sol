// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
    {
        // 👇 deployer ko tokens
        _mint(msg.sender, 1_000_000 ether);
    }

    // 👇 UI wallet ko tokens dene ke liye
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
