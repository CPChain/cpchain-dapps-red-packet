pragma solidity ^0.4.24;

interface IGroupChat {
    /**
     * Send Message to a chat
     * The formation of message need to reference: https://github.com/CPChain/cpchain-dapps-message#methods
     * Emits a {SendMessage} event
     */
    function sendMessage(uint id, string message) external;

    /**
     * Check a member whether is banned
     */
    function isBanned(uint id, address member) external view returns(bool);

    /**
     * Check a group if has this member
     */
    function has(uint id, address member) external view returns(bool);
}
