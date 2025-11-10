// Contract ABIs for YieldForge

export const YieldForgeVaultABI = [
  "function deposit(uint256 assets, address receiver) external returns (uint256 shares)",
  "function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares)",
  "function totalAssets() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function convertToAssets(uint256 shares) external view returns (uint256)",
  "function convertToShares(uint256 assets) external view returns (uint256)",
  "function asset() external view returns (address)",
  "function maxDeposit(address) external view returns (uint256)",
  "function maxWithdraw(address owner) external view returns (uint256)",
  "function reportYield() external",
  "event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
  "event YieldReported(uint256 yieldAmount, uint256 sharesMinted)"
];

export const FundingSplitterABI = [
  "function receiveYieldShares(uint256 shares) external",
  "function splitFunds() external",
  "function qfAllocation() external view returns (uint256)",
  "function retroPGFAllocation() external view returns (uint256)",
  "function sustainabilityAllocation() external view returns (uint256)",
  "function totalDistributed() external view returns (uint256)",
  "event FundsSplit(uint256 qfAmount, uint256 retroAmount, uint256 sustainabilityAmount)"
];

export const QuadraticFundingPoolABI = [
  "function addProject(string memory name, string memory description, address payable recipient) external",
  "function contribute(uint256 projectId, uint256 amount) external",
  "function vote(uint256 projectId) external",
  "function distributeMatching() external",
  "function getProject(uint256 projectId) external view returns (tuple(string name, string description, address recipient, uint256 totalContributions, uint256 contributorCount, uint256 votes, bool active))",
  "function getProjectCount() external view returns (uint256)",
  "function getTotalMatchingPool() external view returns (uint256)",
  "function getUserContribution(address user, uint256 projectId) external view returns (uint256)",
  "event ProjectAdded(uint256 indexed projectId, string name, address recipient)",
  "event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount)",
  "event VoteCast(uint256 indexed projectId, address indexed voter)",
  "event MatchingDistributed(uint256 totalAmount)"
];

export const UniswapV4HookABI = [
  "function beforeSwap(address sender, tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, tuple(bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96) params, bytes hookData) external returns (bytes4)",
  "function afterSwap(address sender, tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, tuple(bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96) params, int256 delta0, int256 delta1, bytes hookData) external returns (bytes4)",
  "function getDonationAmount() external view returns (uint256)",
  "event DonationCollected(address indexed trader, uint256 amount)"
];

export const ERC20ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
