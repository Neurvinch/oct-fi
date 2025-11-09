contract UniswapV4DonationHook is BaseHook {
    address public fundingSplitter;
    uint24 public donationBps = 10; // 0.1%
    event DonationFromSwap(address indexed token, uint256 amount);
    constructor(IPoolManager _poolManager, address _fundingSplitter) BaseHook(_poolManage
        poolManager = _poolManager;
        fundingSplitter = _fundingSplitter;
    }
    function afterSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata
    ) external override returns (bytes4, int128) {
        uint256 swapAmount = uint256(int256(-delta.amount0()));
        if (swapAmount == 0) swapAmount = uint256(int256(-delta.amount1()));
        uint256 donationAmount = (swapAmount * donationBps) / 10000;
        if (donationAmount > 0) {
            IERC20 donationToken = key.currency0 == address(0) ?
                IERC20(address(key.currency1)) : IERC20(address(key.currency0));
            donationToken.safeTransfer(fundingSplitter, donationAmount);
            emit DonationFromSwap(address(donationToken), donationAmount);
        }
        return (BaseHook.afterSwap.selector, 0);
    }
 }