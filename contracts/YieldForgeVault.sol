// SPDX-License-Identfier: MIT
pragma solidity ^0.8.30;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
 import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
 import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
 import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
 import {PaymentSplitter} from "@openzeppelin/contracts/finance/PaymentSplitter.sol";