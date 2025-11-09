 contract QuadraticFundingPool is Ownable {
    IERC20 public immutable asset;
    struct Project {
        address recipient;
        string name;
        uint256 totalContributions;
        uint256 contributorCount;
        bool approved;
    }
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    uint256 public projectCount;
    uint256 public matchingPool;
    event ProjectCreated(uint256 indexed projectId, address recipient);
    event ContributionMade(uint256 indexed projectId, address contributor, uint256 amount
    event MatchingDistributed(uint256 indexed projectId, uint256 matchingAmount);
    constructor(address _asset) Ownable(msg.sender) {
        require(_asset != address(0), "!asset");
 5. FundingSplitter.sol
 6. QuadraticFundingPool.sol
        asset = IERC20(_asset);
    }
    function createProject(address _recipient, string memory _name) external onlyOwner {
        require(_recipient != address(0), "!recipient");
        projects[projectCount] = Project({
            recipient: _recipient,
            name: _name,
            totalContributions: 0,
            contributorCount: 0,
            approved: true
        });
        emit ProjectCreated(projectCount, _recipient);
        projectCount++;
    }
    function contribute(uint256 _projectId, uint256 _amount) external {
        require(_projectId < projectCount, "!project");
        require(_amount > 0, "!amount");
        require(projects[_projectId].approved, "!approved");
        asset.safeTransferFrom(msg.sender, address(this), _amount);
        if (contributions[_projectId][msg.sender] == 0)
            projects[_projectId].contributorCount++;
        contributions[_projectId][msg.sender] += _amount;
        projects[_projectId].totalContributions += _amount;
        emit ContributionMade(_projectId, msg.sender, _amount);
    }
    function distributeMatching(uint256 _projectId) external {
        require(_projectId < projectCount, "!project");
        require(matchingPool > 0, "!pool");
        Project storage project = projects[_projectId];
        uint256 sqrtSum = _sqrt(project.totalContributions);
        uint256 matchingAmount = (sqrtSum * sqrtSum * matchingPool) /
            (project.contributorCount > 0 ? project.contributorCount : 1);
        matchingAmount = matchingAmount > matchingPool ? matchingPool : matchingAmount;
        matchingPool -= matchingAmount;
        asset.safeTransfer(project.recipient, matchingAmount);
        emit MatchingDistributed(_projectId, matchingAmount);
    }
    function addMatchingFunds(uint256 _amount) external {
        asset.safeTransferFrom(msg.sender, address(this), _amount);
        matchingPool += _amount;
    }
    function _sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
 }
