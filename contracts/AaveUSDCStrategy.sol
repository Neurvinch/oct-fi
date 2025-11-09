 contract AaveUSDCStrategy is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public constant USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    IERC4626 public immutable aaveVault; // aUSDC Vault
    constructor(address _aaveVault) Ownable(msg.sender) {
        require(_aaveVault != address(0), "!vault");
        aaveVault = IERC4626(_aaveVault);
        USDC.safeApprove(_aaveVault, type(uint256).max);
    }
    function deposit(uint256 _amount) external {
        USDC.safeTransferFrom(msg.sender, address(this), _amount);
        aaveVault.deposit(_amount, address(this));
    }
    function withdraw(uint256 _amount) external {
        aaveVault.withdraw(_amount, msg.sender, address(this));
    }
    function harvestAndReport() external view returns (uint256) {
        uint256 shares = aaveVault.balanceOf(address(this));
        return aaveVault.convertToAssets(shares);
    }
    function totalAssets() external view returns (uint256) {
        uint256 shares = aaveVault.balanceOf(address(this));
        return aaveVault.convertToAssets(shares);
    }