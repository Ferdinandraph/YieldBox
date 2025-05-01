// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract YieldBlox is Ownable, ReentrancyGuard {
    struct Vault {
        string name;
        IERC20 token;
        uint256 totalDeposits;
        uint256 apy; // APY in basis points (e.g., 500 = 5%)
        bool active;
    }

    struct Proposal {
        uint256 id;
        string description;
        uint256 vaultId;
        uint256 newApy; // Proposed APY in basis points
        uint256 yesVotes;
        uint256 noVotes;
        bool isActive;
        uint256 endTime; // Voting deadline
        bool executed;
    }

    mapping(uint256 => Vault) public vaults;
    mapping(uint256 => mapping(address => uint256)) public userBalances;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public vaultCount;
    uint256 public proposalCount;

    uint256 public constant VOTING_PERIOD = 3 days; // Voting duration
    uint256 public constant MINIMUM_QUORUM = 1e18; // Minimum total votes (1 token)

    event VaultCreated(uint256 indexed vaultId, string name, address token, uint256 apy);
    event Deposited(uint256 indexed vaultId, address indexed user, uint256 amount);
    event Withdrawn(uint256 indexed vaultId, address indexed user, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 vaultId, uint256 newApy);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, uint256 vaultId, uint256 newApy);

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Vault Management
    function createVault(string memory name, address token, uint256 apy) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(apy > 0, "APY must be greater than 0");

        vaults[vaultCount] = Vault({
            name: name,
            token: IERC20(token),
            totalDeposits: 0,
            apy: apy,
            active: true
        });

        emit VaultCreated(vaultCount, name, token, apy);
        vaultCount++;
    }

    function deposit(uint256 vaultId, uint256 amount) external nonReentrant {
        Vault storage vault = vaults[vaultId];
        require(vault.active, "Vault is not active");
        require(amount > 0, "Amount must be greater than 0");

        vault.token.transferFrom(msg.sender, address(this), amount);
        userBalances[vaultId][msg.sender] += amount;
        vault.totalDeposits += amount;

        emit Deposited(vaultId, msg.sender, amount);
    }

    function withdraw(uint256 vaultId, uint256 amount) external nonReentrant {
        Vault storage vault = vaults[vaultId];
        require(vault.active, "Vault is not active");
        require(amount > 0, "Amount must be greater than 0");
        require(userBalances[vaultId][msg.sender] >= amount, "Insufficient balance");

        userBalances[vaultId][msg.sender] -= amount;
        vault.totalDeposits -= amount;
        vault.token.transfer(msg.sender, amount);

        emit Withdrawn(vaultId, msg.sender, amount);
    }

    function getVaults() external view returns (Vault[] memory) {
        Vault[] memory result = new Vault[](vaultCount);
        for (uint256 i = 0; i < vaultCount; i++) {
            result[i] = vaults[i];
        }
        return result;
    }

    function getUserBalance(uint256 vaultId, address user) external view returns (uint256) {
        return userBalances[vaultId][user];
    }

    function setVaultStatus(uint256 vaultId, bool active) external onlyOwner {
        vaults[vaultId].active = active;
    }

    // Governance
    function createProposal(string memory description, uint256 vaultId, uint256 newApy) external {
        require(vaultId < vaultCount, "Invalid vault ID");
        require(newApy > 0, "New APY must be greater than 0");
        require(userBalances[vaultId][msg.sender] > 0, "Must have deposits in vault");

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: description,
            vaultId: vaultId,
            newApy: newApy,
            yesVotes: 0,
            noVotes: 0,
            isActive: true,
            endTime: block.timestamp + VOTING_PERIOD,
            executed: false
        });

        emit ProposalCreated(proposalCount, description, vaultId, newApy);
        proposalCount++;
    }

    function vote(uint256 proposalId, bool support) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.isActive, "Proposal is not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(userBalances[proposal.vaultId][msg.sender] > 0, "No deposits in vault");

        uint256 voteWeight = userBalances[proposal.vaultId][msg.sender];
        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.yesVotes += voteWeight;
        } else {
            proposal.noVotes += voteWeight;
        }

        emit Voted(proposalId, msg.sender, support, voteWeight);
    }

    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.isActive, "Proposal is not active");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.yesVotes + proposal.noVotes >= MINIMUM_QUORUM, "Quorum not reached");

        proposal.isActive = false;
        proposal.executed = true;

        if (proposal.yesVotes > proposal.noVotes) {
            vaults[proposal.vaultId].apy = proposal.newApy;
            emit ProposalExecuted(proposalId, proposal.vaultId, proposal.newApy);
        }
    }

    function getProposals() external view returns (Proposal[] memory) {
        Proposal[] memory result = new Proposal[](proposalCount);
        for (uint256 i = 0; i < proposalCount; i++) {
            result[i] = proposals[i];
        }
        return result;
    }
}