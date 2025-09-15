// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CryptoScoreGuard is SepoliaConfig {
    using FHE for *;
    
    struct Tournament {
        euint32 tournamentId;
        euint32 maxParticipants;
        euint32 currentParticipants;
        euint32 entryFee;
        euint32 prizePool;
        bool isActive;
        bool isRevealed;
        string name;
        string description;
        address organizer;
        uint256 startTime;
        uint256 endTime;
        uint256 revealTime;
    }
    
    struct ScoreSubmission {
        euint32 submissionId;
        euint32 score;
        euint32 rank;
        address player;
        uint256 timestamp;
        bool isRevealed;
    }
    
    struct Player {
        euint32 totalTournaments;
        euint32 totalWins;
        euint32 totalScore;
        euint32 reputation;
        bool isRegistered;
    }
    
    mapping(uint256 => Tournament) public tournaments;
    mapping(uint256 => mapping(address => ScoreSubmission)) public submissions;
    mapping(address => Player) public players;
    mapping(uint256 => address[]) public tournamentParticipants;
    
    uint256 public tournamentCounter;
    uint256 public submissionCounter;
    
    address public owner;
    address public verifier;
    
    event TournamentCreated(uint256 indexed tournamentId, address indexed organizer, string name);
    event ScoreSubmitted(uint256 indexed tournamentId, address indexed player, uint32 encryptedScore);
    event TournamentEnded(uint256 indexed tournamentId);
    event ScoresRevealed(uint256 indexed tournamentId);
    event WinnerAnnounced(uint256 indexed tournamentId, address indexed winner, uint32 score);
    event PlayerRegistered(address indexed player);
    event ReputationUpdated(address indexed player, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    function registerPlayer() public {
        require(!players[msg.sender].isRegistered, "Player already registered");
        
        players[msg.sender] = Player({
            totalTournaments: FHE.asEuint32(0),
            totalWins: FHE.asEuint32(0),
            totalScore: FHE.asEuint32(0),
            reputation: FHE.asEuint32(100), // Starting reputation
            isRegistered: true
        });
        
        emit PlayerRegistered(msg.sender);
    }
    
    function createTournament(
        string memory _name,
        string memory _description,
        uint256 _maxParticipants,
        uint256 _entryFee,
        uint256 _duration
    ) public onlyOwner returns (uint256) {
        require(bytes(_name).length > 0, "Tournament name cannot be empty");
        require(_maxParticipants > 0, "Max participants must be positive");
        require(_duration > 0, "Duration must be positive");
        
        uint256 tournamentId = tournamentCounter++;
        
        tournaments[tournamentId] = Tournament({
            tournamentId: FHE.asEuint32(0), // Will be set properly later
            maxParticipants: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            currentParticipants: FHE.asEuint32(0),
            entryFee: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            prizePool: FHE.asEuint32(0),
            isActive: true,
            isRevealed: false,
            name: _name,
            description: _description,
            organizer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            revealTime: block.timestamp + _duration + 1 hours // 1 hour after tournament ends
        });
        
        emit TournamentCreated(tournamentId, msg.sender, _name);
        return tournamentId;
    }
    
    function joinTournament(uint256 tournamentId) public payable {
        require(players[msg.sender].isRegistered, "Player must be registered");
        require(tournaments[tournamentId].organizer != address(0), "Tournament does not exist");
        require(tournaments[tournamentId].isActive, "Tournament is not active");
        require(block.timestamp < tournaments[tournamentId].endTime, "Tournament has ended");
        require(submissions[tournamentId][msg.sender].player == address(0), "Already joined tournament");
        
        // Check if tournament is full (this would need to be implemented with FHE comparison)
        // For now, we'll allow joining and handle limits off-chain
        
        // Add participant to tournament
        tournamentParticipants[tournamentId].push(msg.sender);
        
        // Update player stats
        players[msg.sender].totalTournaments = FHE.add(players[msg.sender].totalTournaments, FHE.asEuint32(1));
        
        // Update tournament participant count
        tournaments[tournamentId].currentParticipants = FHE.add(tournaments[tournamentId].currentParticipants, FHE.asEuint32(1));
    }
    
    function submitScore(
        uint256 tournamentId,
        externalEuint32 score,
        bytes calldata inputProof
    ) public {
        require(players[msg.sender].isRegistered, "Player must be registered");
        require(tournaments[tournamentId].organizer != address(0), "Tournament does not exist");
        require(tournaments[tournamentId].isActive, "Tournament is not active");
        require(block.timestamp < tournaments[tournamentId].endTime, "Tournament has ended");
        require(submissions[tournamentId][msg.sender].player != address(0), "Must join tournament first");
        require(submissions[tournamentId][msg.sender].score == FHE.asEuint32(0), "Score already submitted");
        
        uint256 submissionId = submissionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalScore = FHE.fromExternal(score, inputProof);
        
        submissions[tournamentId][msg.sender] = ScoreSubmission({
            submissionId: FHE.asEuint32(0), // Will be set properly later
            score: internalScore,
            rank: FHE.asEuint32(0), // Will be calculated after reveal
            player: msg.sender,
            timestamp: block.timestamp,
            isRevealed: false
        });
        
        // Update player total score
        players[msg.sender].totalScore = FHE.add(players[msg.sender].totalScore, internalScore);
        
        emit ScoreSubmitted(tournamentId, msg.sender, 0); // Score will be decrypted off-chain
    }
    
    function endTournament(uint256 tournamentId) public onlyOwner {
        require(tournaments[tournamentId].organizer != address(0), "Tournament does not exist");
        require(tournaments[tournamentId].isActive, "Tournament is not active");
        require(block.timestamp >= tournaments[tournamentId].endTime, "Tournament has not ended yet");
        
        tournaments[tournamentId].isActive = false;
        emit TournamentEnded(tournamentId);
    }
    
    function revealScores(uint256 tournamentId) public onlyVerifier {
        require(tournaments[tournamentId].organizer != address(0), "Tournament does not exist");
        require(!tournaments[tournamentId].isActive, "Tournament must be ended first");
        require(!tournaments[tournamentId].isRevealed, "Scores already revealed");
        require(block.timestamp >= tournaments[tournamentId].revealTime, "Reveal time not reached");
        
        tournaments[tournamentId].isRevealed = true;
        emit ScoresRevealed(tournamentId);
    }
    
    function announceWinner(uint256 tournamentId, address winner, euint32 winningScore) public onlyVerifier {
        require(tournaments[tournamentId].organizer != address(0), "Tournament does not exist");
        require(tournaments[tournamentId].isRevealed, "Scores must be revealed first");
        require(winner != address(0), "Invalid winner address");
        
        // Update winner's stats
        players[winner].totalWins = FHE.add(players[winner].totalWins, FHE.asEuint32(1));
        
        // Update reputation (winner gets +10 reputation)
        players[winner].reputation = FHE.add(players[winner].reputation, FHE.asEuint32(10));
        
        emit WinnerAnnounced(tournamentId, winner, 0); // Score will be decrypted off-chain
    }
    
    function updateReputation(address player, euint32 newReputation) public onlyVerifier {
        require(players[player].isRegistered, "Player must be registered");
        require(player != address(0), "Invalid player address");
        
        players[player].reputation = newReputation;
        emit ReputationUpdated(player, 0); // FHE.decrypt(newReputation) - will be decrypted off-chain
    }
    
    function getTournamentInfo(uint256 tournamentId) public view returns (
        string memory name,
        string memory description,
        uint8 maxParticipants,
        uint8 currentParticipants,
        uint8 entryFee,
        uint8 prizePool,
        bool isActive,
        bool isRevealed,
        address organizer,
        uint256 startTime,
        uint256 endTime,
        uint256 revealTime
    ) {
        Tournament storage tournament = tournaments[tournamentId];
        return (
            tournament.name,
            tournament.description,
            0, // FHE.decrypt(tournament.maxParticipants) - will be decrypted off-chain
            0, // FHE.decrypt(tournament.currentParticipants) - will be decrypted off-chain
            0, // FHE.decrypt(tournament.entryFee) - will be decrypted off-chain
            0, // FHE.decrypt(tournament.prizePool) - will be decrypted off-chain
            tournament.isActive,
            tournament.isRevealed,
            tournament.organizer,
            tournament.startTime,
            tournament.endTime,
            tournament.revealTime
        );
    }
    
    function getPlayerInfo(address player) public view returns (
        uint8 totalTournaments,
        uint8 totalWins,
        uint8 totalScore,
        uint8 reputation,
        bool isRegistered
    ) {
        Player storage playerData = players[player];
        return (
            0, // FHE.decrypt(playerData.totalTournaments) - will be decrypted off-chain
            0, // FHE.decrypt(playerData.totalWins) - will be decrypted off-chain
            0, // FHE.decrypt(playerData.totalScore) - will be decrypted off-chain
            0, // FHE.decrypt(playerData.reputation) - will be decrypted off-chain
            playerData.isRegistered
        );
    }
    
    function getSubmissionInfo(uint256 tournamentId, address player) public view returns (
        uint8 score,
        uint8 rank,
        uint256 timestamp,
        bool isRevealed
    ) {
        ScoreSubmission storage submission = submissions[tournamentId][player];
        return (
            0, // FHE.decrypt(submission.score) - will be decrypted off-chain
            0, // FHE.decrypt(submission.rank) - will be decrypted off-chain
            submission.timestamp,
            submission.isRevealed
        );
    }
    
    function getTournamentParticipants(uint256 tournamentId) public view returns (address[] memory) {
        return tournamentParticipants[tournamentId];
    }
    
    function withdrawPrize(uint256 tournamentId) public {
        require(tournaments[tournamentId].organizer != address(0), "Tournament does not exist");
        require(tournaments[tournamentId].isRevealed, "Tournament must be revealed first");
        require(msg.sender == tournaments[tournamentId].organizer, "Only organizer can withdraw");
        
        // Transfer prize pool to organizer
        // Note: In a real implementation, funds would be transferred based on decrypted amount
        tournaments[tournamentId].isActive = false;
        
        // For now, we'll transfer a placeholder amount
        // payable(msg.sender).transfer(prizePool);
    }
}
