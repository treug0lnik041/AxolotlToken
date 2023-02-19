// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/// @title Axolotl Token
/// @author github: treug0lnik041, telegram: @treug0lnik
/// @notice ERC20 Token
/// @dev Can be minted by owner
contract AxolotlToken is Ownable, ERC20 {
	constructor(uint256 _firstMinted) ERC20("Axolotl Token", "AXLTL") {
		_mint(owner(), _firstMinted);
	}

	function decimals() public pure override(ERC20) returns(uint8) {
		return 6;
	}

	function redeem(address _to, uint256 _amount) external onlyOwner {
		_mint(_to, _amount);
	}
}