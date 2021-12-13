pragma solidity ^0.4.24;

import "./interfaces/IGroupChat.sol";

contract RedPacket {
    address owner; // owner has permissions to modify parameters
    bool public enabled = true; // if upgrade contract, then the old contract should be disabled
    
    address groupChatAddress;
    IGroupChat groupchatInstance;

    uint256 public period = 1 days;

    struct Packet {
        uint group_id;
        address sender;
        uint count;
        uint256 amount;
        uint remain_cnt;
        uint256 remains; // remaining fund
        bool existed;
        bool refunded;
        uint256 created_at;
        mapping(address => bool) grabbed; // every address can only grab one packet
    }

    uint packet_seq = 0;

    mapping(uint => Packet) packets;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner of this contract");
        _;
    }

    modifier onlyEnabled() {
        require(enabled);
        _;
    }

    constructor(address groupchat) public {
        owner = msg.sender;
        groupChatAddress = groupchat;
        groupchatInstance = IGroupChat(groupchat);
    }

    function changeGroupChat(address groupchat) public onlyOwner {
        groupChatAddress = groupchat;
        groupchatInstance = IGroupChat(groupchat);   
    }

    // owner can enable and disable rnode contract
    function enableContract() public onlyOwner {
        enabled = true;
    }

    function disableContract() public onlyOwner {
        enabled = false;
    }

    function setPeriod(uint256 new_period) public onlyEnabled onlyOwner {
        require(new_period > 1 minutes, "The period should greater than 1 minute");
        period = new_period;
    }

    /**
     * Change the owner of the contract. If the address is a contract, the contract should be IAdmin.
     */
    function changeOwner(address to) external onlyEnabled onlyOwner {
        owner = to;
    }
}
