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


     function _deployfunds(uint256 amount) internal override {

        if(stratergies.length == 0)  return;

        uint256 perStartegy = amount / stratergies.length;

        for(uint i = 0 , i < stratergies.length; i++) {

           if(perStratgy > 0 ) {

            asset.safeApprove(address(strategies[i]), perStartegy);
           try strategies[i].deposit(perStartegy) {} catch {}
           }
        }
   }


   function _freeFunds( uint256 _amount) internal override {
       
      uint256 needed = _amount;

       for(uint i = 0 , i < stratrgies.length && nedded > 0; i++) {

        uint256 available = strategies[i].totalAssests();
        uint256 toWithdraw = available < needed ? available : needed;

        try strategies[i].withdraw(towithdraw){
            needed -= toWithdraw;
        }
        catch {

        }
         
         
       }
   }

   function report() external onlyKeepet returns (uint256 gain) {

     uint256 totalAssests = _getTotalAssests();
     uint256 previousAssests = lastReportedAssests == 0 ? totalAssests : lastReportedAssests;

     if(totalAssests > previousAssests ) {

        gain = totalAssests - previousAssests;
     } 

     else {

        uint256 loss = previousAssests - totalAssests;

        if(doHealthCheck && loss > 0) {
            require(loss <= (previousAssests * lossLimitRatio) / 10000, "loss limit exceeded");
        }
     }

        if( doHealthCheck && gain > 0) {
            require(gain <= (previousAssests * profitLimitRatio) / 10000, "profit limit exceeded");

            lastReportedAssests = totalAssests;
            accumulatedYield += gain;

            if(gain > 0)  {
                uint256 shareToMint = _convertToShares(gain, Math.Rounding.Down);
                _mint(fundingSplitter, shareToMint);
                emit YieldDonated(gain);
            } 

             emit ReportExecuted(totalAssests, gain);
             return gain;       
             }


function addStartegy(address _strategy) external onlyManagement{

    require(_strategy != address(0), "!strategy");
    strategies.push(IStrategy(_strategy));
    emit StrategyAdded(_strategy);

}

     function removeStartegy(uint256 _index) external onlyManagement {

        require(_index < strategies.length, "!index");

        address removed  = address(strategies[_index]);

        strategies[_index] = strategies[strategies.length - 1];
        strategies.pop();
        emit StrategyRemoved(removed);

   }




 }