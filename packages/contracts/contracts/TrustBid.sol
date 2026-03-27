// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title TrustBid - Decentralized Auction Platform
/// @notice Main contract for the TrustBid dApp
contract TrustBid is Ownable, ReentrancyGuard {
    // ============================================================
    //                        STRUCTS
    // ============================================================

    struct Auction {
        uint256 id;
        address seller;
        string title;
        string description;
        uint256 startingPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool settled;
        bool active;
    }

    // ============================================================
    //                         EVENTS
    // ============================================================

    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed seller,
        uint256 startingPrice,
        uint256 endTime
    );

    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    event AuctionSettled(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 amount
    );

    event AuctionCancelled(uint256 indexed auctionId);

    // ============================================================
    //                        STATE
    // ============================================================

    uint256 public auctionCount;
    uint256 public platformFee; // basis points (e.g. 250 = 2.5%)

    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public pendingReturns;

    // ============================================================
    //                      CONSTRUCTOR
    // ============================================================

    constructor(uint256 _platformFee) Ownable(msg.sender) {
        platformFee = _platformFee;
    }

    // ============================================================
    //                       FUNCTIONS
    // ============================================================

    function createAuction(
        string calldata _title,
        string calldata _description,
        uint256 _startingPrice,
        uint256 _duration
    ) external returns (uint256) {
        require(_startingPrice > 0, "Starting price must be > 0");
        require(_duration >= 1 hours, "Duration must be at least 1 hour");
        require(_duration <= 30 days, "Duration must be at most 30 days");

        uint256 auctionId = ++auctionCount;
        uint256 endTime = block.timestamp + _duration;

        auctions[auctionId] = Auction({
            id: auctionId,
            seller: msg.sender,
            title: _title,
            description: _description,
            startingPrice: _startingPrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: endTime,
            settled: false,
            active: true
        });

        emit AuctionCreated(auctionId, msg.sender, _startingPrice, endTime);
        return auctionId;
    }

    function placeBid(uint256 _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];

        require(auction.active, "Auction is not active");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.sender != auction.seller, "Seller cannot bid");

        uint256 minBid = auction.highestBid > 0
            ? auction.highestBid
            : auction.startingPrice;

        require(msg.value > minBid, "Bid must exceed current highest bid");

        if (auction.highestBidder != address(0)) {
            pendingReturns[_auctionId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    function settleAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];

        require(auction.active, "Auction is not active");
        require(block.timestamp >= auction.endTime, "Auction has not ended");
        require(!auction.settled, "Auction already settled");

        auction.settled = true;
        auction.active = false;

        if (auction.highestBidder != address(0)) {
            uint256 fee = (auction.highestBid * platformFee) / 10000;
            uint256 sellerProceeds = auction.highestBid - fee;

            (bool feeSuccess, ) = owner().call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");

            (bool sellerSuccess, ) = auction.seller.call{value: sellerProceeds}("");
            require(sellerSuccess, "Seller transfer failed");

            emit AuctionSettled(_auctionId, auction.highestBidder, auction.highestBid);
        }
    }

    function withdraw(uint256 _auctionId) external nonReentrant {
        uint256 amount = pendingReturns[_auctionId][msg.sender];
        require(amount > 0, "Nothing to withdraw");

        pendingReturns[_auctionId][msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function cancelAuction(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];

        require(msg.sender == auction.seller || msg.sender == owner(), "Not authorized");
        require(auction.active, "Auction is not active");
        require(auction.highestBidder == address(0), "Cannot cancel auction with bids");

        auction.active = false;

        emit AuctionCancelled(_auctionId);
    }

    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = _newFee;
    }

    function getAuction(uint256 _auctionId) external view returns (Auction memory) {
        return auctions[_auctionId];
    }
}
