pragma solidity ^0.4.24;

interface IRedPacket {
    event CreateRedPacket(uint indexed group_id, uint indexed packet_id, address sender, string bless, uint256 amount, uint count, bool msg_sent);
    event GrabRedPacket(uint indexed group_id, uint indexed packet_id, address receiver, uint256 amount);
    event Refund(uint indexed packet_id, uint256 remains);

    /**
     * Create a red packet. Specify the group_id and the count of sub red packet.
     * This function will send an application message in the group chat.
     * Emits {CreateRedPacket} event
     * Returns packet ID.
     */
    function createRedPacket(uint group_id, uint count, string bless) external payable returns (uint);

    /**
     * Grab a red packet.
     * Emits {GrabRedPacket} event
     */
    function grabRedPacket(uint packet_id) external;

    /**
     * Refund after specify period if the red packet still remain.
     * Emits {Refund} event
     */
    function refund(uint packet_id) external;

}
