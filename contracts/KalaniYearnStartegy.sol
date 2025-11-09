// SPDX-License-Identfier: MIT
pragma solidity ^0.8.30;
 
 contract KalaniYearnStrategy is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable asset;
    IERC4626 public immutable yearnVault;
    constructor(address _asset, address _yearnVault) Ownable(msg.sender) {
        require(_asset != address(0), "!asset");
        require(_yearnVault != address(0), "!vault");
        asset = IERC20(_asset);
        yearnVault = IERC4626(_yearnVault);
        asset.safeApprove(_yearnVault, type(uint256).max);
    }
    function deposit(uint256 _amount) external {
        asset.safeTransferFrom(msg.sender, address(this), _amount);
        yearnVault.deposit(_amount, address(this));
    }
    function withdraw(uint256 _amount) external {
        yearnVault.withdraw(_amount, msg.sender, address(this));
    }
    function harvestAndReport() external view returns (uint256) {
        uint256 shares = yearnVault.balanceOf(address(this));
        return yearnVault.convertToAssets(shares);
    }
    function totalAssets() external view returns (uint256) {
        uint256 shares = yearnVault.balanceOf(address(this));
        return yearnVault.convertToAssets(shares);
    }
 }