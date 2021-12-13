pragma solidity ^0.4.24;

import "./interfaces/IGroupChat.sol";
import "./lib/safeMath.sol";
import "./interfaces/IRedPacket.sol";

contract RedPacket is IRedPacket {
    using SafeMath for uint;
    using SafeMath for uint256;
    address owner; // owner has permissions to modify parameters
    bool public enabled = true; // if upgrade contract, then the old contract should be disabled
    
    address groupChatAddress;
    IGroupChat groupchatInstance;

    uint256 public period = 1 days;
    uint256 public upper = 10000 ether; // The upper per packet
    uint public sub_packet_cnt_upper = 100;

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

    mapping(uint => Packet) internal packets;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner of this contract");
        _;
    }

    modifier onlyEnabled() {
        require(enabled);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function strConcat(string _a, string _b) internal pure returns (string){
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        string memory ab = new string(a.length + b.length);
        bytes memory aAB = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < a.length; i++) aAB[k++] = a[i];
        for (i = 0; i < b.length; i++) aAB[k++] = b[i];
        return string(aAB);
    }

    function uintToString(uint v) internal pure returns (string str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }
        bytes memory s = new bytes(i + 1);
        for (uint j = 0; j <= i; j++) {
            s[j] = reversed[i - j];
        }
        str = string(s);
    }

    function setGroupChat(address groupchat) public onlyOwner {
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

    function setUpper(uint256 new_upper) public onlyEnabled onlyOwner {
        require(new_upper >= 1 ether, "The upper per packet can not be less than 1");
        require(new_upper <= 1000000 ether, "The upper per packet can not be greater than 1 million");
        upper = new_upper;
    }

    function setSubPacketCntUpper(uint new_cnt) public onlyEnabled onlyOwner {
        require(sub_packet_cnt_upper > 1, "The upper can't be less than 1");
        sub_packet_cnt_upper = new_cnt;
    }

    /**
     * Create a red packet. Specify the group_id and the count of sub red packet.
     * This function will send an application message in the group chat.
     * Emits {CreateRedPacket} event
     * Returns packet ID.
     */
    function createRedPacket(uint group_id, uint count) external payable onlyEnabled returns (uint) {
        require(msg.value <= upper, "The value can't be greater than the upper");
        require(msg.value >= 1 ether, "The value can't less than 1 CPC");
        require(count >= 1, "The count should greater than 1");
        require(count <= sub_packet_cnt_upper, "The count should less than the upper");
        packet_seq += 1;
        packets[packet_seq] = Packet({
            group_id: group_id,
            sender: msg.sender,
            count: count,
            amount: msg.value,
            remain_cnt: count,
            remains: msg.value,
            existed: true,
            refunded: false,
            created_at: block.timestamp
        });
        bool sent = false;
        if (groupChatAddress != address(0x0)) {
            require(groupchatInstance.has(group_id, msg.sender), "You are not in this group");
            require(groupchatInstance.isBanned(group_id, msg.sender), "You have been banned");
            // message
            string memory _id = uintToString(packet_seq);
            string memory msg0 = "{\"message\":{\"seq\":";
            string memory msg1 = "},\"type\":\"redpacket\",\"version\":\"2.1\"}";
            string memory message = strConcat(msg0, _id);
            message = strConcat(message, msg1);
            groupchatInstance.sendMessage(group_id, message);
            sent = true;
        }
        emit CreateRedPacket(group_id, packet_seq, msg.sender, msg.value, count, sent);
    }

    /**
     * Grap a red packet.
     * Emits {GrapRedPacket} event
     */
    function grapRedPacket(uint packet_id) external {
        require(packets[packet_id].existed, "This packet not found");
        require(packets[packet_id].remains > 0, "This packet is empty now");
        require(packets[packet_id].remain_cnt > 0, "This packet is empty now");
        require(!packets[packet_id].grabbed[msg.sender], "You have grabbed");
        if (groupChatAddress != address(0x0)) {
            require(groupchatInstance.has(packets[packet_id].group_id, msg.sender), "You are not in this group");
            require(groupchatInstance.isBanned(packets[packet_id].group_id, msg.sender), "You have been banned");
        }
        uint256 random = packets[packet_id].remains;
        if (packets[packet_id].remain_cnt > 1) {
            // range: (M/N * 2)，M 为金额，N 为红包个数，保证均值相等
            uint256 range = packets[packet_id].remains / packets[packet_id].remain_cnt * 2;
            random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, packet_id, 
                packets[packet_id].amount, msg.sender, packets[packet_id].sender))) % range;
        }
        packets[packet_id].remains -= random;
        packets[packet_id].remain_cnt -= 1;
        packets[packet_id].grabbed[msg.sender] = true;
        msg.sender.transfer(random);
        emit GrapRedPacket(packets[packet_id].group_id, packet_id, random);
    }

    /**
     * Refund after specify period if the red packet still remain.
     * Emits {Refund} event
     */
    function refund(uint packet_id) external {
        require(packets[packet_id].existed, "This packet not found");
        require(packets[packet_id].remains > 0, "This packet is empty now");
        require(packets[packet_id].remain_cnt > 0, "This packet is empty now");
        require(packets[packet_id].created_at + period <= block.timestamp, "Your red packet is still locked");
        require(packets[packet_id].sender == msg.sender, "You are not the sender of the packet");
        msg.sender.transfer(packets[packet_id].remains);
        packets[packet_id].remains = 0;
        packets[packet_id].refunded = true;
    }

    /**
     * Change the owner of the contract. If the address is a contract, the contract should be IAdmin.
     */
    function changeOwner(address to) external onlyEnabled onlyOwner {
        owner = to;
    }
}
