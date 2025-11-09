contract FundingSplitter is PaymentSplitter {
    IERC20 public immutable asset;
    address public qfPool;
    address public retroPGF;
    address public sustainabilityFund;
    constructor(
        address _qfPool,
        address _retroPGF,
        address _sustainabilityFund,
        address _asset
    ) PaymentSplitter(
        [_qfPool, _retroPGF, _sustainabilityFund], [70, 20, 10]
    ) {
        require(_asset != address(0), "!asset");
        asset = IERC20(_asset);
        qfPool = _qfPool;
        retroPGF = _retroPGF;
        sustainabilityFund = _sustainabilityFund;
    }
    function distributeYield() external {
        uint256 balance = asset.balanceOf(address(this));
        require(balance > 0, "!balance");
        uint256 qfAmount = (balance * 70) / 100;
        uint256 retroAmount = (balance * 20) / 100;
        uint256 sustainAmount = balance - qfAmount - retroAmount;
        asset.safeTransfer(qfPool, qfAmount);
        asset.safeTransfer(retroPGF, retroAmount);
        asset.safeTransfer(sustainabilityFund, sustainAmount);
    }
 }