// SPDX-License-Identfier: MIT
pragma solidity ^0.8.30;

contract SparkDAIStrategy is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public constant DAI = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    IERC4626 public immutable sparkVault; // sDAI
    constructor(address _sparkVault) Ownable(msg.sender) {
        require(_sparkVault != address(0), "!vault");
        sparkVault = IERC4626(_sparkVault);
        DAI.safeApprove(_sparkVault, type(uint256).max);
    }
    function deposit(uint256 _amount) external {
 2. AaveUSDCStrategy.sol
 3. SparkDAIStrategy.sol
        DAI.safeTransferFrom(msg.sender, address(this), _amount);
        sparkVault.deposit(_amount, address(this));
    }
    function withdraw(uint256 _amount) external {
        sparkVault.withdraw(_amount, msg.sender, address(this));
    }
    function harvestAndReport() external view returns (uint256) {
        uint256 idle = DAI.balanceOf(address(this));
        uint256 shares = sparkVault.balanceOf(address(this));
        return idle + sparkVault.convertToAssets(shares);
    }
    function totalAssets() external view returns (uint256) {
        uint256 idle = DAI.balanceOf(address(this));
        uint256 shares = sparkVault.balanceOf(address(this));
        return idle + sparkVault.convertToAssets(shares);
    }
 }