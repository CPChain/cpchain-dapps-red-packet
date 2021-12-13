pragma solidity ^0.4.24;

interface IRedPacket {
    event CreateRedPacket(uint indexed group_id, uint indexed packed_id, address sender, uint256 amount, uint count, bool msg_sent);
    event GrapRedPacket(uint indexed group_id, uint indexed packet_id, uint256 amount);
    event Refund(uint indexed packet_id, uint256 remains);

    /**
     * Create a red packet. Specify the group_id and the count of sub red packet.
     * This function will send an application message in the group chat.
     * Emits {CreateRedPacket} event
     * Returns packet ID.
     */
    function createRedPacket(uint group_id, uint count) external payable returns (uint);

    /**
     * Grap a red packet.
     * Emits {GrapRedPacket} event
     */
    function grapRedPacket(uint packet_id) external;

    /**
     * Refund after specify period if the red packet still remain.
     * Emits {Refund} event
     */
    function refund(uint packet_id) external;

}
