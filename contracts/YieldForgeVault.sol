// SPDX-License-Identfier: MIT
pragma solidity ^0.8.30;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
 import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
 import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
 import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
 import {PaymentSplitter} from "@openzeppelin/contracts/finance/PaymentSplitter.sol";

 contract YieldForgeVault is ERC4626, Ownable {

    using SafeERC20 for IERC20;

    address public fundingSplitter;
    IStrategy public strategies;
    uint256 public lastReportedAssests;
    uint256 public accumulatedYield;

    uint256 public profitLimitRatio =  1000;
    uint256 public lossLimitRatio = 500;
    bool public doHealthChech = true;

    address public management;
    address public keeper;
    address public emergencyAdmin;

    event StartegyAdded(address indexed strategy);
    event StartegyRemoved(address indexed strategy);
    event Yielddonated(uint256 amount);
    event ReportExecuted(uint56 totalAssests, uint256 yieldGenerated);

    modifier onlyManagement () {
        require(msg.sender == management || msg.sender == owner(),"!management");
        _;

    }

    modifier onlyKeeper () {
        require(msg.sender == keeper || msg.sender == owner(),"!keeper");
        _;

 }

   constructor(
    IERC20 _asset,
    string memory _name,
    address _fundingSplitter,
    address _management,
    address _keeper,
    address _emergencyAdmin
   ) ERC4626(_asset) ERC20(_name, "YfUSDC") Ownable(msg.sender){


      require(address(_asset) != address(0),"!asset");
        require(_fundingSplitter != address(0),"!fundingSplitter");

        fundingSplitter = _fundingSplitter;
        management = _management;
        keeper = _keeper;
        emergencyAdmin = _emergencyAdmin;

        lastReportedAssests = 0;
   }

 }